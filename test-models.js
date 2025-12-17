const { VertexAI } = require('@google-cloud/vertexai');

async function listModels() {
    try {
        const vertexAI = new VertexAI({
            project: 'rfp-accelerator-agent',
            location: 'us-central1',
            googleAuthOptions: {
                keyFile: 'service-account-key.json'
            }
        });

        const modelsToTest = [
            'gemini-1.5-flash-001',
            'gemini-1.5-flash',
            'gemini-1.0-pro-001',
            'gemini-1.0-pro',
            'gemini-pro',
            'gemini-1.5-pro-preview-0409' // Try a preview one
        ];

        console.log("Starting Model Test...");

        for (const modelName of modelsToTest) {
            console.log(`\n--- Testing ${modelName} ---`);

            // Test 1: Standard
            try {
                const model = vertexAI.getGenerativeModel({ model: modelName });
                await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: 'Hi' }] }]
                });
                console.log(`[STANDARD] SUCCESS`);
                // If this worked, we found it!
                break;
            } catch (e) {
                console.log(`[STANDARD] FAILED: ${e.message.split('{\"error\"')[0]} ...`); // excessive output truncation
            }

            // Test 2: Preview
            try {
                const model = vertexAI.preview.getGenerativeModel({ model: modelName });
                await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: 'Hi' }] }]
                });
                console.log(`[PREVIEW] SUCCESS`);
                // If this worked, we found it!
                break;
            } catch (e) {
                console.log(`[PREVIEW] FAILED: ${e.message.split('{\"error\"')[0]} ...`);
            }
        }

    } catch (e) {
        console.error("Critical error:", e);
    }
}

listModels();
