'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FileUpload from "@/components/FileUpload";
import RfpDashboard from "@/components/RfpDashboard";

export default function Home() {
  const [data, setData] = useState<any>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc] text-slate-900 font-sans">
      <Header />

      <main className="flex-1 flex flex-col items-center pt-32 pb-20 px-4">
        {/* Hero Section */}
        <div className="text-center mb-16 max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-[850] tracking-tight mb-6 leading-[1.1]">
            Automate your <span className="gradient-text">RFP Response</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Upload your RFP documents and let our AI agent analyze, score, and draft a
            winning response in seconds.
          </p>
        </div>

        {/* Action Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-10">
          <FileUpload onUploadComplete={setData} />
          <RfpDashboard initialData={data} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
