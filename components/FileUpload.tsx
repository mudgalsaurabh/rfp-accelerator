'use client';

import { useState, useRef } from 'react';
import { CloudUpload, FileText, Loader2, AlertCircle, FilePlus } from 'lucide-react';

interface FileUploadProps {
    onUploadComplete: (data: any) => void;
}

export default function FileUpload({ onUploadComplete }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [kbUrl, setKbUrl] = useState('https://www.intelia.com.au/');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            validateAndSelect(files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSelect(e.target.files[0]);
        }
    };

    const validateAndSelect = (file: File) => {
        setError(null);
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        const validExtensions = ['.pdf', '.docx', '.xlsx'];
        const hasValidExt = validExtensions.some(ext => file.name.endsWith(ext));

        if (!validTypes.includes(file.type) && !hasValidExt) {
            setError('Invalid file format. Please upload PDF, Word, or Excel.');
            return;
        }
        setSelectedFile(file);
    };

    const handleProcess = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/rfp/process', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            onUploadComplete(data);
            setSelectedFile(null);
        } catch (err) {
            setError('An error occurred during upload. Please try again.');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] p-10 card-shadow border border-slate-50 flex flex-col h-full min-h-[550px]">
            <div className="flex items-center gap-2.5 mb-8">
                <CloudUpload className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Document Upload</h2>
            </div>

            <div className="flex-1 flex flex-col">
                <div
                    className={`flex-1 min-h-[220px] border-2 border-dashed rounded-[1.5rem] flex flex-col items-center justify-center p-8 transition-all duration-300 cursor-pointer mb-8 group
                        ${isDragging ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-primary/40 hover:bg-slate-50/50'}
                        ${selectedFile ? 'bg-indigo-50/30 border-primary/30' : ''}
                    `}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        file-input-id="rfp-file-input"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.docx,.xlsx"
                        onChange={handleFileChange}
                    />

                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 group-hover:bg-white transition-all duration-300 shadow-sm">
                        {selectedFile ? <FileText className="w-8 h-8 text-primary" /> : <FilePlus className="w-8 h-8 text-slate-300" />}
                    </div>

                    {selectedFile ? (
                        <div className="text-center">
                            <p className="font-bold text-slate-800 text-lg">{selectedFile.name}</p>
                            <p className="text-sm text-primary font-semibold mt-2 px-3 py-1 bg-primary/10 rounded-full inline-block">Ready to process</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="font-bold text-slate-700 text-lg mb-2">Drop your file here, or click to browse</p>
                            <p className="text-sm text-slate-400 font-medium">PDF, DOCX, or XLSX</p>
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-3 tracking-wide">Company Knowledge Base URL</label>
                        <input
                            type="text"
                            input-id="kb-url-input"
                            value={kbUrl}
                            onChange={(e) => setKbUrl(e.target.value)}
                            className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                        />
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-rose-50 text-rose-600 text-sm font-semibold flex items-center gap-3 border border-rose-100">
                            <AlertCircle className="w-5 h-5" />
                            {error}
                        </div>
                    )}

                    <button
                        button-id="process-rfp-button"
                        onClick={handleProcess}
                        disabled={!selectedFile || isUploading}
                        className={`w-full py-4 text-lg font-bold shadow-xl transition-all duration-300 rounded-xl flex items-center justify-center gap-2
                            ${!selectedFile || isUploading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                : 'bg-primary text-white hover:bg-primary-hover hover:scale-[1.01] hover:shadow-primary/20 active:scale-[0.99]'}
                        `}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-6 h-6 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Process RFP'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
