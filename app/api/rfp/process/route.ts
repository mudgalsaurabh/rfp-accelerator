import { NextRequest, NextResponse } from 'next/server';
import { parsePdf } from '@/lib/parsers/pdf';
import { parseDocx } from '@/lib/parsers/docx';
import { parseExcel } from '@/lib/parsers/excel';
import { initializeKnowledgeBase, searchSimilarDocuments } from '@/lib/rag/store';
import { generateEmbedding, generateChatResponse } from '@/lib/rag/embeddings';
import { generateRfpDocx } from '@/lib/utils/docx-generator';

export async function POST(request: NextRequest) {
    try {
        // ensuring knowledge base is ready
        await initializeKnowledgeBase();

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileType = file.type;
        const fileName = file.name;

        let text = '';

        if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            text = await parsePdf(buffer);
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileName.endsWith('.docx')
        ) {
            text = await parseDocx(buffer);
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            fileName.endsWith('.xlsx')
        ) {
            text = await parseExcel(buffer);
        } else {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
        }

        // Simple heuristic question extraction
        const questions = text.split('\n')
            .filter(line => line.trim().endsWith('?') || line.toLowerCase().includes('question') || line.toLowerCase().includes('requirement'))
            // Filter out very short lines or likely noise
            .filter(line => line.length > 15)
            // .slice(0, 5) // Removed limit
            .map(q => q.trim());

        if (questions.length === 0) {
            return NextResponse.json({
                success: true,
                text: text.substring(0, 2000),
                results: [{ question: "No specific questions detected.", answer: "Please review the document manually or try a different file." }]
            });
        }

        const results = [];

        for (const question of questions) {
            try {
                // 1. Retrieve Context
                const qEmbedding = await generateEmbedding(question);
                const similarDocs = searchSimilarDocuments(qEmbedding, 4);
                const contextText = similarDocs.map(d => `[Source: ${d.source}]\n${d.text}`).join('\n\n');

                // 2. Generate Answer
                const systemPrompt = `You are an RFP Assistant. Your goal is to answer the user's question based on the provided Context Information from previous RFPs and QnA documents.

Context Information:
${contextText}

Instructions:
1. Answer the question using ONLY the provided context if possible.
2. If the context doesn't contain the answer, state that you don't have enough information from the knowledge base.
3. After the answer, suggest 2-3 follow-up questions for the client to clarify requirements if the answer is incomplete or if more detail is needed.
4. Format the output clearly.
`;
                const answer = await generateChatResponse(systemPrompt, question);

                results.push({
                    question,
                    answer,
                    sources: similarDocs.map(d => d.source)
                });
            } catch (err) {
                console.error(`Error processing question "${question}":`, err);
                results.push({ question, answer: "Error generating response.", sources: [] });
            }
        }

        // Generate DOCX
        let docxBase64 = '';
        try {
            const docxBuffer = await generateRfpDocx(results);
            docxBase64 = docxBuffer.toString('base64');
        } catch (docxErr) {
            console.error('Error generating document:', docxErr);
        }

        return NextResponse.json({
            success: true,
            text: text.substring(0, 2000),
            results,
            docxBase64
        });

    } catch (error) {
        console.error('Upload processing error:', error);
        return NextResponse.json({ error: 'Internal server error processing file' }, { status: 500 });
    }
}
