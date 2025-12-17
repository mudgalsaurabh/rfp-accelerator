'use client';

import { useState, useRef } from 'react';
import { Upload, File, Loader2, AlertCircle } from 'lucide-react';

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
        // We could append kbUrl here if the backend supported it, for now just UI

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
            setSelectedFile(null); // Reset after success
        } catch (err) {
            setError('An error occurred during upload. Please try again.');
            console.error(err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div
                className={`flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-all duration-200 cursor-pointer mb-6 group
                    ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'}
                    ${selectedFile ? 'bg-blue-50 border-blue-200' : ''}
                `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".pdf,.docx,.xlsx"
                    onChange={handleFileChange}
                />

                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {selectedFile ? <File className="w-6 h-6 text-primary" /> : <File className="w-6 h-6 text-gray-400" />}
                </div>

                {selectedFile ? (
                    <div className="text-center">
                        <p className="font-semibold text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Ready to process</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="font-medium text-gray-900 mb-1">Drop your file here, or click to browse</p>
                        <p className="text-xs text-gray-400">PDF, DOCX, or TXT</p>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Knowledge Base URL</label>
                    <input
                        type="text"
                        value={kbUrl}
                        onChange={(e) => setKbUrl(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <button
                    onClick={handleProcess}
                    disabled={!selectedFile || isUploading}
                    className="w-full btn btn-primary py-3.5 text-base font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            Processing...
                        </>
                    ) : (
                        'Process RFP'
                    )}
                </button>
            </div>
        </div>
    );
}
