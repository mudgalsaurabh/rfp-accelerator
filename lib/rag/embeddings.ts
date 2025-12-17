
// Helper to get lazy client
async function getVertexClient() {
    // usage of require to avoid build-time analysis issues
    // @ts-ignore
    const { VertexAI } = require('@google-cloud/vertexai');

    const project = 'rfp-accelerator-agent';
    const location = 'us-central1';
    const keyFile = 'service-account-key.json';

    return new VertexAI({
        project: project,
        location: location,
        googleAuthOptions: {
            keyFile: keyFile
        }
    });
}

export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        // Fallback to REST API because SDK v1.10.0 seems to miss embedContent in standard model interface
        // or requires specific preview usage that is flaky in this env.
        const { GoogleAuth } = require('google-auth-library');
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
            keyFile: 'service-account-key.json'
        });
        const client = await auth.getClient();
        const projectId = await auth.getProjectId();
        const location = 'us-central1';
        const modelId = 'gemini-embedding-001';
        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predict`;

        const res = await client.request({
            url,
            method: 'POST',
            data: {
                instances: [{ content: text }]
            }
        });

        // @ts-ignore
        const embeddings = res.data?.predictions?.[0]?.embeddings?.values;
        if (!embeddings) {
            throw new Error("Failed to generate embedding: No values returned from REST API.");
        }
        return embeddings;

    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error; // This will surface invalid_grant if auth fails
    }
}

export async function generateChatResponse(systemPrompt: string, userMessage: string): Promise<string> {
    try {
        const vertexAI = await getVertexClient();
        const generativeModel = vertexAI.getGenerativeModel({ model: 'gemini-pro' });

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
