'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FileUpload from '@/components/FileUpload';
import RfpDashboard from '@/components/RfpDashboard';

export default function UploadPage() {
    const [data, setData] = useState<any>(null);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 container py-10 pt-24">
                {!data ? (
                    <div className="max-w-2xl mx-auto text-center space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-4">Upload RFP Document</h1>
                            <p className="text-white/60">
                                Supports PDF, DOCX, and Excel files. We'll automatically identify questions for you.
                            </p>
                        </div>

                        <FileUpload onUploadComplete={setData} />
                    </div>
                ) : (
                    <RfpDashboard initialData={data} />
                )}
            </main>

            <Footer />
        </div>
    );
}
