import { NextRequest, NextResponse } from 'next/server';
import { parsePdf } from '@/lib/parsers/pdf';
import { parseDocx } from '@/lib/parsers/docx';
import { parseExcel } from '@/lib/parsers/excel';
import { chunkText } from '@/lib/rag/chunking';
import { generateEmbedding } from '@/lib/rag/embeddings';
import { addDocuments, clearStore } from '@/lib/rag/store';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const action = formData.get('action') as string; // 'ingest' or 'clear'

        if (action === 'clear') {
            clearStore();
            return NextResponse.json({ success: true, message: 'Knowledge base cleared' });
        }

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileType = file.type;
        const fileName = file.name;
        let text = '';

        // Reuse parsers
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

        // RAG Pipeline
        const chunks = chunkText(text);
        const documentsWithEmbeddings = [];

        for (const chunk of chunks) {
            const embedding = await generateEmbedding(chunk);
            documentsWithEmbeddings.push({
                text: chunk,
                source: fileName,
                embedding
            });
        }

        addDocuments(documentsWithEmbeddings);

        return NextResponse.json({
            success: true,
            chunkCount: chunks.length,
            message: `Successfully added ${chunks.length} chunks from ${fileName} to Knowledge Base.`
        });

    } catch (error) {
        console.error('Ingestion error:', error);
        return NextResponse.json({ error: 'Internal server error processing file' }, { status: 500 });
    }
}
