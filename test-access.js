const { VertexAI } = require('@google-cloud/vertexai');

async function testAccess() {
    console.log("Initializing VertexAI...");
    const vertexAI = new VertexAI({
        project: 'rfp-accelerator-agent',
        location: 'australia-southeast1',
        googleAuthOptions: {
            keyFile: 'service-account-key.json'
        }
    });

    // Test 1: Chat
    console.log("\n--- Test 1: Chat (gemini-1.5-flash-001) ---");
    try {
        const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash-001' });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
        });
        console.log("Chat Success!");
    } catch (e) {
        console.log("Chat Failed details:");
        console.log(e.message);
        if (e.message.includes('404')) {
            console.log("--> This usually means the API is not enabled OR the Service Account lacks 'Vertex AI User' role.");
        }
    }

    // Test 2: Embeddings (SDK)
    console.log("\n--- Test 2: Embeddings SDK (gemini-embedding-001) ---");
    try {
        const model = vertexAI.getGenerativeModel({ model: 'gemini-embedding-001' });
        const result = await model.embedContent("Hello world");
        console.log("Embedding Success!");
    } catch (e) {
        console.log("Embedding Failed details:");
        console.log(e.message);
    }
}

testAccess();
