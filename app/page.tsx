'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import RfpDashboard from "@/components/RfpDashboard";
import { Copy, RefreshCw, FileText } from "lucide-react";

export default function Home() {
  const [data, setData] = useState<any>(null);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <Header />

      <main className="flex-1 flex flex-col items-center pt-24 pb-20 px-4 md:px-8">
        {/* Hero */}
        <div className="text-center mb-12 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-gray-900">
            Automate your <span className="text-primary">RFP Response</span>
          </h1>
          <p className="text-lg text-gray-500">
            Upload your RFP documents and let our AI agent analyze, score, and draft a<br className="hidden md:block" />
            winning response in seconds.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Left Column: Upload */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6">
              <div className="text-primary">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Document Upload</h2>
            </div>

            <div className="flex-1 flex flex-col">
              <FileUpload onUploadComplete={setData} />
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full min-h-[500px]">
            <div className="flex items-center gap-2 mb-6">
              <div className="text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Analysis Results</h2>
            </div>

            <div className="flex-1">
              {!data ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 p-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <RefreshCw className="w-8 h-8 text-gray-300" />
                  </div>
                  <p>Results will appear here after analysis</p>
                </div>
              ) : (
                <RfpDashboard initialData={data} />
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="card hover:border-primary/50 transition-colors">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/60">{description}</p>
    </div>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  );
}
