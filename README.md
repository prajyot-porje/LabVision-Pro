# 🧬 LabVision Pro

LabVision Pro is an AI-powered web application for analyzing medical lab reports. Upload images (PNG, JPG, JPEG) or PDF files and receive instant, professional analysis with abnormal value detection and color-coded results. Lab reports are processed using OCR and sent securely to the Gemini AI model for analysis.

## Features

- 📄 **Smart Upload:** Drag-and-drop support for images and PDFs (up to 10MB)
- ⚡ **Instant Analysis:** Real-time parsing and abnormal value detection using OCR and AI
- 📊 **Professional Results:** Color-coded, easy-to-read tables for lab values
- 📱 **Responsive Design:** Works seamlessly on all devices
- 🔒 **Authentication:** Secure sign-in/sign-up with Clerk

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Tesseract.js (OCR)
- Clerk (Authentication)
- Google Gemini API (AI analysis)
- React PDF (PDF parsing)
- Lucide React (Icons)

## Data Privacy

> **Note:** Uploaded lab reports are processed using OCR in your browser and then sent securely to the Gemini API for AI-powered analysis. Do not upload sensitive personal information unless you are comfortable with this data flow.

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/prajyot-porje/LabVision-Pro.git
cd labvision-pro
```

### 2. Install dependencies

```sh
npm install
# or
yarn install
```

### 3. Configure environment variables

Copy the example below into a `.env.local` file and fill in your API keys:

<details>
<summary><strong>.env.example</strong></summary>

```env
# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key-here

# Clerk (Authentication) Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# Clerk Auth URLs (optional, for custom routing)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```
</details>

### 4. Run the development server

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

1. Sign up or sign in.
2. Upload your lab report (image or PDF).
3. Wait for instant AI-powered analysis.
4. View results in a color-coded, professional table.

> **Disclaimer:** This tool is for educational and project purposes only. Do not rely on it for medical decisions. Always consult a healthcare professional.

## Folder Structure

- `app/` — Next.js app directory (pages, layouts)
- `components/` — UI and custom React components
- `lib/` — Utility functions
- `public/` — Static assets


---

© 2025 LabVision Pro. All rights reserved.