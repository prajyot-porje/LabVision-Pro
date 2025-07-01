"use client";

import type React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { createWorker } from "tesseract.js";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Zap,
  Shield,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { AlertDialogTemplate } from "@/components/custom/AlertDialog";

interface LabResult {
  parameter: string;
  value: string;
  unit: string;
  normalRange: string;
  status: "normal" | "high" | "low" | "unknown";
}

export default function LabAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; title: string; msg: string }>({
    open: false,
    title: "",
    msg: "",
  });
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [pendingAnalyze, setPendingAnalyze] = useState(false);
  const router = useRouter();

  const onBack = () => {
    router.push("/");
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "application/pdf",
    ];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setAlert({
        open: true,
        title: "Invalid File Type",
        msg: "Please upload a PNG, JPG, JPEG, or PDF file.",
      });
      return false;
    }

    if (file.size > maxSize) {
      setAlert({
        open: true,
        title: "File Too Large",
        msg: "File size must be less than 10MB.",
      });
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const extractTextFromImage = async (file: File) => {
    const worker = await createWorker("eng");
    const ret = await worker.recognize(file);
    console.log(ret.data.text);
    const text = ret.data.text;
    await worker.terminate();
    return text;
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const { pdfjs } = await import("react-pdf");
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.mjs";

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }

    return text;
  };

  const analyzeLabReport = async (rawText: string) => {
    const res = await axios.post("/api/AI_response", {
      text: rawText,
    });

    if (res.status !== 200) throw new Error("AI analysis failed");
    return res.data;
  };

  const processingRef = useRef(false);
  const processImage = async () => {
    setShowDisclaimer(false); 
    setPendingAnalyze(false); 

    if (!file) return;

    setIsProcessing(true);
    setProgress(0);
    setExtractedText("");
    setLabResults([]);
    setError(null);

    processingRef.current = true;

    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else {
        text = await extractTextFromImage(file);
      }

      setExtractedText(text);
      const results = await analyzeLabReport(text);
      if (typeof results === "string" && results === "NOT_LAB_REPORT") {
        setAlert({
          open: true,
          title: "Invalid Report",
          msg: "The uploaded file does not appear to be a valid medical lab report. Please upload a proper lab report.",
        });
        setLabResults([]);
        return;
      }

      setLabResults(results);
    } catch (err: any) {
      setError(err.message || "Processing failed");
      setShowAlert(true);
    } finally {
      setIsProcessing(false);
      setProgress(100);
      processingRef.current = false;
    }
  };
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isProcessing) {
      setProgress(0);
      let current = 0;
      const step = 80 / 30; 
      interval = setInterval(() => {
        current += step;
        if (current >= 80) {
          current = 80;
          setProgress(80);
          if (interval) clearInterval(interval);
        } else {
          setProgress(Math.floor(current));
        }
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);
  useEffect(() => {
    if (!isProcessing && processingRef.current === false) {
      setProgress(100);
    }
  }, [isProcessing]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "low":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <XCircle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "low":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBack}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    LabVision Pro
                  </h1>
                  <p className="text-sm text-slate-500">
                    AI-Powered Lab Report Analysis
                  </p>
                </div>
              </div>
              <div>
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AlertDialogTemplate
        title={alert.title}
        msg={alert.msg}
        open={alert.open}
        openchange={() => {
          setAlert({ open: false, title: "", msg: "" });
          setFile(null);
          setExtractedText("");
          setLabResults([]);
          setError(null);
        }}
      />
      {showAlert && error && (
        <AlertDialogTemplate
          title="Processing Error"
          msg={error}
          open={showAlert}
          openchange={() => {
            setShowAlert(false);
            setFile(null);
            setExtractedText("");
            setLabResults([]);
            setError(null);
          }}
        />
      )}

      {/* Disclaimer AlertDialog */}
      {showDisclaimer && (
        <AlertDialogTemplate
          title="Disclaimer"
          msg="This is an AI model for educational and project purposes only. The analysis may present incorrect values. Do not rely on it for medical decisions. Kindly consult a doctor for accurate interpretation."
          open={showDisclaimer}
          openchange={() => {
            setShowDisclaimer(false);
            if (pendingAnalyze) processImage();
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                Upload Your Lab Report
              </h2>
              <p className="text-slate-600">
                Get instant AI-powered analysis of your medical lab results
              </p>
            </div>

            <div
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                dragActive
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-300 hover:border-slate-400 hover:bg-slate-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-slate-100 rounded-full">
                  <Upload className="h-8 w-8 text-slate-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 mb-1">
                    Drop your files here
                  </h3>
                  <p className="text-slate-500 mb-4">
                    or click to browse from your device
                  </p>
                </div>

                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button
                    className="cursor-pointer bg-blue-600 hover:bg-blue-700"
                    asChild
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Choose File
                    </span>
                  </Button>
                </label>

                <div className="flex items-center gap-6 text-sm text-slate-500 mt-4">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Secure & Private
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    Fast Processing
                  </div>
                </div>
              </div>

              {file && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-blue-900">{file.name}</p>
                        <p className="text-sm text-blue-600">
                          {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                          {file.type.includes("pdf")
                            ? "PDF Document"
                            : "Image File"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 text-center text-sm text-slate-500">
              Supports PNG, JPG, JPEG, PDF files up to 10MB
            </div>
          </div>

          {/* Process Button */}
          {file && !isProcessing && (
            <div className="px-8 pb-8">
              <Button
                onClick={() => {
                  setShowDisclaimer(true);
                  setPendingAnalyze(true);
                }}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                <Activity className="h-5 w-5 mr-2" />
                Analyze Lab Report
              </Button>
            </div>
          )}
        </div>

        {/* Processing State */}
        {isProcessing && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Analyzing Your Lab Report
                </h3>
                <p className="text-slate-600">
                  {file?.type === "application/pdf"
                    ? "Extracting text from PDF document..."
                    : "Using advanced OCR to read your report..."}
                </p>
              </div>
              <div className="max-w-md mx-auto">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-slate-500 mt-2">
                  {progress}% complete
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {labResults.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-8 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-900 mb-1">
                    Analysis Results
                  </h2>
                  <p className="text-slate-600">
                    AI-powered interpretation of your lab values
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Eye className="h-4 w-4" />
                  {labResults.length} parameters analyzed
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="p-8 border-b border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-1">
                    {labResults.filter((r) => r.status === "normal").length}
                  </div>
                  <div className="text-emerald-800 font-medium">
                    Normal Values
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {labResults.filter((r) => r.status === "high").length}
                  </div>
                  <div className="text-red-800 font-medium">High Values</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-1">
                    {labResults.filter((r) => r.status === "low").length}
                  </div>
                  <div className="text-amber-800 font-medium">Low Values</div>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {["high", "low", "normal", "unknown"].map((status) => {
                const group = labResults.filter((r) => r.status === status);
                if (group.length === 0) return null;
                return (
                  <div key={status} className="mb-8">
                    <table className="w-full mb-4">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left p-4 font-semibold text-slate-900">
                            Parameter
                          </th>
                          <th className="text-left p-4 font-semibold text-slate-900">
                            Value
                          </th>
                          <th className="text-left p-4 font-semibold text-slate-900">
                            Unit
                          </th>
                          <th className="text-left p-4 font-semibold text-slate-900">
                            Normal Range
                          </th>
                          <th className="text-left p-4 font-semibold text-slate-900">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {group.map((result, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-4 font-medium text-slate-900">
                              {result.parameter}
                            </td>
                            <td className="p-4 text-lg font-semibold text-slate-900">
                              {result.value}
                            </td>
                            <td className="p-4 text-slate-600">
                              {result.unit}
                            </td>
                            <td className="p-4 text-slate-600">
                              {result.normalRange}
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(result.status)}
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                                    result.status
                                  )}`}
                                >
                                  {result.status.toUpperCase()}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            {/* Extracted Text */}
            {extractedText && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Extracted Text
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Raw text extracted from your document
                  </p>
                </div>
                <div className="p-6">
                  <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                      {extractedText}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
