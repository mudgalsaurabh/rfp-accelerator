import path from 'path';
import fs from 'fs';
import { parsePdf } from '@/lib/parsers/pdf';
import { chunkText } from './chunking';
import { generateEmbedding } from './embeddings';

type DocumentChunk = {
    id: string;
    text: string;
    embedding: number[];
    source: string;
};

declare global {
    var vectorStore: DocumentChunk[];
    var isInitialized: boolean;
}

if (!global.vectorStore) {
    global.vectorStore = [];
    global.isInitialized = false;
}

export async function initializeKnowledgeBase() {
    if (global.isInitialized) {
        console.log("Knowledge Base already initialized.");
        return;
    }

    console.log("Initializing Knowledge Base...");

    try {
        const artifactsDir = path.join(process.cwd(), 'artifacts', 'Source Information');
        const qnaDir = path.join(artifactsDir, 'Existing QnA');
        const rfpDir = path.join(artifactsDir, 'Existing RFPs');

        const filesToProcess: { path: string; source: string }[] = [];

        // Helper to collect files
        const collectFiles = (dir: string) => {
            if (fs.existsSync(dir)) {
                const files = fs.readdirSync(dir);
                for (const file of files) {
                    if (file.toLowerCase().endsWith('.pdf')) {
                        filesToProcess.push({
                            path: path.join(dir, file),
                            source: file
                        });
                    }
                }
            } else {
                console.warn(`Directory not found: ${dir}`);
            }
        };

        collectFiles(qnaDir);
        collectFiles(rfpDir);

        console.log(`Found ${filesToProcess.length} files to process.`);

        for (const file of filesToProcess) {
            console.log(`Processing ${file.source}...`);
            const buffer = fs.readFileSync(file.path);
            const text = await parsePdf(buffer);
            const chunks = chunkText(text);

            for (const chunkText of chunks) {
                try {
                    const embedding = await generateEmbedding(chunkText);
                    global.vectorStore.push({
                        id: Math.random().toString(36).substring(7),
                        text: chunkText,
                        embedding,
                        source: file.source
                    });
                } catch (e) {
                    console.error(`Failed to embed chunk in ${file.source}:`, e);
                }
            }
        }

        global.isInitialized = true;
        console.log(`Knowledge Base initialization complete. Total chunks: ${global.vectorStore.length}`);

    } catch (error) {
        console.error("Failed to initialize Knowledge Base:", error);
    }
}

export function addDocuments(chunks: { text: string; source: string; embedding: number[] }[]) {
    const newDocs = chunks.map(chunk => ({
        id: Math.random().toString(36).substring(7),
        ...chunk
    }));
    global.vectorStore.push(...newDocs);
    console.log(`Added ${newDocs.length} chunks to store. Total: ${global.vectorStore.length}`);
}

export function searchSimilarDocuments(queryEmbedding: number[], topK: number = 3): { text: string; score: number; source: string }[] {
    if (global.vectorStore.length === 0) return [];

    const results = global.vectorStore.map(doc => {
        const score = cosineSimilarity(queryEmbedding, doc.embedding);
        return { ...doc, score };
    });

    return results
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(({ text, score, source }) => ({ text, score, source }));
}

function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    // Avoid division by zero
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function clearStore() {
    global.vectorStore = [];
    global.isInitialized = false;
}
