const { VertexAI } = require('@google-cloud/vertexai');

async function testChat() {
    console.log("Initializing VertexAI for Chat Test...");
    const vertexAI = new VertexAI({
        project: 'rfp-accelerator-agent',
        location: 'australia-southeast1',
        googleAuthOptions: {
            keyFile: 'service-account-key.json'
        }
    });

    async function testModel(modelId) {
        console.log(`\n--- Testing ${modelId} ---`);
        try {
            const model = vertexAI.getGenerativeModel({ model: modelId });
            const result = await model.generateContent({
                contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
            });
            const response = await result.response;
            console.log(`✅ ${modelId} Success:`, response.candidates[0].content.parts[0].text);
        } catch (error) {
            console.log(`❌ ${modelId} Failed:`, error.message);
        }
    }

    try {
        await testModel('gemini-1.5-flash');
        await testModel('gemini-1.5-flash-001');
        await testModel('gemini-1.5-flash-002');
        await testModel('gemini-1.5-pro');
        await testModel('gemini-1.5-pro-001');
        await testModel('gemini-1.5-pro-002');
    } catch (globalError) {
        console.error("Global Error:", globalError);
    }
}

testChat();
