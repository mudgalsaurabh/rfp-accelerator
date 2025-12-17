'use client';

import { useState } from 'react';
import { Sparkles, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';

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
    };
}

export default function RfpDashboard({ initialData }: RfpDashboardProps) {
    const [questions, setQuestions] = useState<Question[]>(
        (initialData.results || []).map((r, i) => ({
            id: `q-${i}`,
            text: r.question,
            answer: r.answer,
            sources: r.sources
        }))
    );

    // Fallback logic
    if (questions.length === 0 && initialData.questions) {
        setQuestions(initialData.questions.map((q, i) => ({ id: `q-${i}`, text: q })));
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
        } catch (e) {
            console.error(e);
            alert('Failed to generate answer');
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Detected Questions ({questions.length})</h3>
                <button className="text-primary text-sm font-medium hover:underline">Export All</button>
            </div>

            <div className="space-y-4">
                {questions.map((q) => (
                    <div key={q.id} className="bg-gray-50 rounded-xl p-5 border border-gray-100 transition-all hover:shadow-md">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                    Q
                                </div>
                            </div>
                            <div className="flex-1 space-y-3">
                                <p className="font-medium text-gray-900 leading-snug">{q.text}</p>

                                {q.answer ? (
                                    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                                        <div className="flex items-center gap-2 mb-2 text-primary text-xs font-semibold uppercase tracking-wide">
                                            <Sparkles className="w-3 h-3" />
                                            AI Suggestion
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap mb-3">{q.answer}</p>

                                        {q.sources && q.sources.length > 0 && (
                                            <div className="mb-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs text-gray-400 font-medium mb-1">Sources</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {q.sources.map((s, i) => (
                                                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] rounded-md truncate max-w-[150px]">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-2 mt-2">
                                            <button className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600" title="Copy">
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 hover:bg-green-50 rounded-md transition-colors text-gray-400 hover:text-green-600" title="Good">
                                                <ThumbsUp className="w-3.5 h-3.5" />
                                            </button>
                                            <button className="p-1.5 hover:bg-red-50 rounded-md transition-colors text-gray-400 hover:text-red-500" title="Bad">
                                                <ThumbsDown className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => generateAnswer(q.id, q.text)}
                                        disabled={generating === q.id}
                                        className="inline-flex items-center text-xs font-medium text-primary hover:text-primary-hover disabled:opacity-50"
                                    >
                                        {generating === q.id ? (
                                            'Generating answer...'
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3 mr-1.5" />
                                                Generate Answer
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
