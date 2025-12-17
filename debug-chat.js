const { VertexAI } = require('@google-cloud/vertexai');

async function testChat() {
    console.log("Initializing VertexAI for Chat Test...");
    const vertexAI = new VertexAI({
        project: 'rfp-accelerator-agent',
        location: 'us-central1',
        googleAuthOptions: {
            keyFile: 'service-account-key.json'
        }
    });

    try {
        console.log("Getting model: gemini-pro");
        const model = vertexAI.getGenerativeModel({ model: 'gemini-pro' });

        console.log("Sending request: 'Hello'");
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
        });

        const responseCallback = await result.response;
        const text = responseCallback.candidates?.[0]?.content?.parts?.[0]?.text;

        console.log("✅ Chat Success!");
        console.log("Response:", text);

    } catch (e) {
        console.log("❌ Chat Failed details:");
        console.log(e.message);
    }
}

testChat();
