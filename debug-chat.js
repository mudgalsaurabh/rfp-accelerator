const { VertexAI } = require('@google-cloud/vertexai');

async function testChat() {
    console.log("Initializing VertexAI for Chat Test...");
    const vertexAI = new VertexAI({
        project: '680149411946',
        location: 'australia-southeast1',
        googleAuthOptions: {
            keyFile: 'service-account-key.json'
        }
    });

    try {
        console.log("Getting model: text-bison");
        const model = vertexAI.getGenerativeModel({ model: 'text-bison' });

        console.log("Sending request: 'Hello'");
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: 'Hello' }] }]
        });

        const response = await result.response;
        console.log("✅ Chat Success:", response.candidates[0].content.parts[0].text);

    } catch (e) {
        console.log("❌ Chat Failed details:");
        console.log(e.message);
    }
}

testChat();
