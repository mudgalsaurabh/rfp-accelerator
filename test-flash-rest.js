const { GoogleAuth } = require('google-auth-library');

async function testFlash() {
    console.log("Authenticating...");
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
        keyFile: 'service-account-key.json'
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    const location = 'australia-southeast1';
    const modelId = 'gemini-1.5-flash-001'; // Try specific version first

    console.log(`Project: ${projectId}`);
    console.log(`Location: ${location}`);

    // Endpoint for generateContent
    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:streamGenerateContent`;

    console.log(`URL: ${url}`);

    try {
        const res = await client.request({
            url,
            method: 'POST',
            data: {
                contents: [{ role: 'user', parts: [{ text: 'Say hi' }] }]
            }
        });

        console.log("Success!");
        console.log("Status:", res.status);
    } catch (e) {
        console.log("Failed!");
        console.log("Status:", e.response ? e.response.status : 'Unknown');
        if (e.response && e.response.data) {
            console.log("Error Detail:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.log("Error:", e.message);
        }
    }
}

testFlash();
