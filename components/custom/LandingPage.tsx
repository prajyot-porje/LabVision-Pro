"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Upload, FileText, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Star } from "lucide-react"
import { useRouter } from "next/navigation"


export default function LandingPage() {

  const router = useRouter();
  const features = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600" />,
      title: "Smart Upload",
      description: "Support for images (PNG, JPG, JPEG) and PDF lab reports with drag-and-drop functionality",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Instant Analysis",
      description: "Real-time parsing and analysis of lab values with abnormal result detection",
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: "Privacy First",
      description: "All processing happens in your browser - your data never leaves your device",
    },
  ]

  const benefits = [
    "Extract text from both image and PDF lab reports",
    "Automatic detection of abnormal values",
    "Professional table format with color-coded results",
    "Real-time progress tracking during processing",
    "Responsive design works on all devices",
  ]

  const onGetStarted = () => {
    router.push("/analyzer")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">LabVision Pro</span>
            </div>
            <Button onClick={onGetStarted} className="bg-blue-600 hover:bg-blue-700">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4" />
              AI-Powered Lab Report Analysis
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                Lab Reports
              </span>
              <br />
              Into Insights
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Upload your lab report images or PDFs and get instant, professional analysis with abnormal value
              detection. Powered by advanced OCR technology, completely private and secure.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button onClick={onGetStarted} size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              <FileText className="mr-2 h-5 w-5" />
              Analyze Lab Report
            </Button>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features for Professional Analysis</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to analyze lab reports quickly and accurately, with enterprise-grade security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose LabVision Pro?</h2>
              <p className="text-xl text-gray-600 mb-8">
                Built with healthcare professionals in mind, our platform combines cutting-edge AI with user-friendly
                design to deliver accurate results every time.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button onClick={onGetStarted} size="lg" className="mt-8 bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Start Analyzing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Hemoglobin</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">14.2 g/dL</div>
                      <div className="text-sm text-gray-600">12.0-15.5 g/dL</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-red-600" />
                      <span className="font-medium">Glucose</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">125 mg/dL</div>
                      <div className="text-sm text-gray-600">70-100 mg/dL</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">Cholesterol</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-yellow-600">65 mg/dL</div>
                      <div className="text-sm text-gray-600">{"<200 mg/dL"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Lab Reports?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust LabVision Pro for accurate, fast, and secure lab report
            analysis.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
          >
            <FileText className="mr-2 h-5 w-5" />
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold">LabVision Pro</span>
          </div>
          <p className="text-gray-400 mb-4">Advanced lab report analysis powered by AI technology</p>
          <p className="text-sm text-gray-500">
            © 2025 LabVision Pro. All rights reserved. 
          </p>
        </div>
      </footer>
    </div>
  )
}
