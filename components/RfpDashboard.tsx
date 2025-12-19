'use client';

import { useState } from 'react';
import { Sparkles, Copy, ThumbsUp, ThumbsDown, FileDown, CheckCircle2, Beaker, RefreshCw } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    answer?: string;
    sources?: string[];
}

interface RfpDashboardProps {
    initialData: {
        text: string;
        results?: { question: string; answer: string; sources: string[] }[];
        questions?: string[]; // Fallback
        docxBase64?: string;
    } | null;
}

export default function RfpDashboard({ initialData }: RfpDashboardProps) {
    const [questions, setQuestions] = useState<Question[]>(
        (initialData?.results || []).map((r, i) => ({
            id: `q-${i}`,
            text: r.question,
            answer: r.answer,
            sources: r.sources
        }))
    );
    const [docxData, setDocxData] = useState<string | undefined>(initialData?.docxBase64);

    // Update state when initialData changes
    if (initialData && questions.length === 0 && (initialData.results || initialData.questions)) {
        const newQs = (initialData.results || []).map((r, i) => ({
            id: `q-${i}`,
            text: r.question,
            answer: r.answer,
            sources: r.sources
        }));
        setQuestions(newQs);
        setDocxData(initialData.docxBase64);
    }

    const [generating, setGenerating] = useState<string | null>(null);

    const generateAnswer = async (id: string, questionText: string) => {
        setGenerating(id);
        try {
            const res = await fetch('/api/rfp/answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: questionText })
            });

            const data = await res.json();

            setQuestions(prev => prev.map(q => {
                if (q.id === id) {
                    return {
                        ...q,
                        answer: data.answer,
                        sources: data.sources
                    };
                }
                return q;
            }));

            // If we have a single answer generation, docxBase64 won't be updated here.
            // Ideally we'd regenerate it or handle it, but for now we'll focus on the bulk processing.

        } catch (e) {
            console.error(e);
            alert('Failed to generate answer');
        } finally {
            setGenerating(null);
        }
    };

    const handleExport = () => {
        if (!docxData) {
            alert("No export data available. Try processing the file again.");
            return;
        }

        const link = document.createElement('a');
        link.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${docxData}`;
        link.download = 'RFP_Responses.docx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-[2rem] p-10 card-shadow border border-slate-50 flex flex-col h-full min-h-[550px]">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Analysis Results</h2>
                </div>
                {questions.length > 0 && (
                    <button
                        onClick={handleExport}
                        disabled={!docxData}
                        className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary text-sm font-bold rounded-xl hover:bg-primary/10 transition-colors disabled:opacity-50"
                    >
                        <FileDown className="w-4 h-4" />
                        Export (.docx)
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-hidden">
                {!initialData || questions.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-500">
                        <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
                            <Beaker className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-bold text-lg max-w-[200px] leading-snug">
                            Results will appear here after analysis
                        </p>
                    </div>
                ) : (
                    <div className="h-full overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {questions.map((q) => (
                            <div key={q.id} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                                            Q
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <p className="font-bold text-slate-800 leading-snug text-[15px]">{q.text}</p>

                                        {q.answer ? (
                                            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm animate-in fade-in zoom-in-95 duration-300">
                                                <div className="flex items-center gap-2 mb-3 text-primary text-[11px] font-black uppercase tracking-[0.1em]">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                    AI Proposal
                                                </div>
                                                <p className="text-slate-600 text-[14px] leading-relaxed whitespace-pre-wrap mb-4 font-medium">{q.answer}</p>

                                                {q.sources && q.sources.length > 0 && (
                                                    <div className="mb-4 pt-4 border-t border-slate-50">
                                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Verified Sources</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {q.sources.map((s, i) => (
                                                                <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-md border border-slate-100">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-primary" title="Copy" onClick={() => navigator.clipboard.writeText(q.answer || '')}>
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-slate-400 hover:text-emerald-500" title="Good">
                                                        <ThumbsUp className="w-4 h-4" />
                                                    </button>
                                                    <button className="p-2 hover:bg-rose-50 rounded-lg transition-colors text-slate-400 hover:text-rose-500" title="Bad">
                                                        <ThumbsDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => generateAnswer(q.id, q.text)}
                                                disabled={generating === q.id}
                                                className="inline-flex items-center text-xs font-bold text-primary hover:text-primary-hover disabled:opacity-50"
                                            >
                                                {generating === q.id ? (
                                                    <RefreshCw className="w-3.5 h-3.5 mr-2 animate-spin" />
                                                ) : (
                                                    <Sparkles className="w-3.5 h-3.5 mr-2" />
                                                )}
                                                {generating === q.id ? 'Thinking...' : 'Generate AI Proposal'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
