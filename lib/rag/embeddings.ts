
// Helper to get lazy client
async function getVertexClient() {
    // usage of require to avoid build-time analysis issues
    // @ts-ignore
    const { VertexAI } = require('@google-cloud/vertexai');

    const project = 'rfp-accelerator-agent';
    const location = 'australia-southeast1';
    const keyFile = 'service-account-key.json';
    const keyExists = require('fs').existsSync(keyFile);

    const authOptions = keyExists ? { keyFile } : {};

    return new VertexAI({
        project: project,
        location: location,
        googleAuthOptions: authOptions
    });
}

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const { GoogleAuth } = require('google-auth-library');
        const keyFile = 'service-account-key.json';
        const keyExists = require('fs').existsSync(keyFile);

        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
            ...(keyExists ? { keyFile } : {})
        });

        const client = await auth.getClient();
        const projectId = 'rfp-accelerator-agent';
        const location = 'australia-southeast1';

        // UPDATE: Use text-embedding-004 for better regional support
        const modelId = 'text-embedding-004';
        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predict`;

        const res = await client.request({
            url,
            method: 'POST',
            data: {
                instances: [{
                    content: text,
                    task_type: 'RETRIEVAL_DOCUMENT' // Required for this model
                }]
            }
        });

        // @ts-ignore
        const embeddings = res.data?.predictions?.[0]?.embeddings?.values;
        if (!embeddings) {
            throw new Error("Failed to generate embedding: No values returned.");
        }
        return embeddings;

    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}

export async function generateChatResponse(systemPrompt: string, userMessage: string): Promise<string> {
    try {
        const vertexAI = await getVertexClient();
        const generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const result = await generativeModel.generateContent({
            contents: [
                { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }] }
            ]
        });

        const responseCallback = await result.response;
        // Vertex SDK candidate structure
        const text = responseCallback.candidates?.[0]?.content?.parts?.[0]?.text;

        return text || "No response generated.";
    } catch (error) {
        console.error("Error generating chat response:", error);
        throw error;
    }
}
