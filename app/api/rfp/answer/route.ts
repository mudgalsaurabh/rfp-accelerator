import { NextRequest, NextResponse } from 'next/server';
import { generateEmbedding, generateChatResponse } from '@/lib/rag/embeddings';
import { searchSimilarDocuments } from '@/lib/rag/store';

export async function POST(request: NextRequest) {
    try {
        const { question, context } = await request.json(); // context here means 'RFP context' if any, but we mainly use KB

        if (!question) {
            return NextResponse.json({ error: 'Question is required' }, { status: 400 });
        }

        // 1. Generate embedding for the question
        const questionEmbedding = await generateEmbedding(question);

        // 2. Search Knowledge Base
        const similarDocs = searchSimilarDocuments(questionEmbedding, 3);

        // 3. Construct Context String
        const contextString = similarDocs.map(doc => `[Source: ${doc.source}]\n${doc.text}`).join('\n\n');

        // 4. Construct System Prompt
        const systemPrompt = `You are an expert RFP Proposal Writer. 
    your task is to answer the specific RFP question based PRIMARILY on the provided Knowledge Base context.
    If the answer is not in the context, use your general knowledge but mention that it was not found in the documents.
    
    Context from Knowledge Base:
    ---
    ${contextString}
    ---
    
    End of Context.
    `;

        // 5. Generate Answer
        const answer = await generateChatResponse(systemPrompt, question);

        return NextResponse.json({
            answer,
            sources: similarDocs.map(d => d.source)
        });

    } catch (error) {
        console.error('Q&A generation error:', error);
        return NextResponse.json({ error: 'Internal server error generating answer' }, { status: 500 });
    }
}
