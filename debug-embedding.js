
async function testEmbedding() {
    try {
        const { VertexAI } = require('@google-cloud/vertexai');
        const vertexAI = new VertexAI({
            project: 'rfp-accelerator-agent',
            location: 'australia-southeast1',
            googleAuthOptions: {
                keyFile: 'service-account-key.json'
            }
        });

        console.log("vertexAI.preview:", vertexAI.preview);
        if (vertexAI.preview) {
            const model = vertexAI.preview.getGenerativeModel({ model: 'gemini-embedding-001' });
            console.log("Preview Model keys:", Object.keys(model));
            console.log("Preview Model proto:", Object.getOwnPropertyNames(Object.getPrototypeOf(model)));
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

testEmbedding();
