
const { GoogleAuth } = require('google-auth-library');

async function testRest() {
    console.log("Testing REST API...");
    try {
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });
        const client = await auth.getClient();
        const projectId = await auth.getProjectId();
        const location = 'us-central1';
        const modelId = 'text-embedding-004';

        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predict`;

        console.log(`URL: ${url}`);

        const res = await client.request({
            url,
            method: 'POST',
            data: {
                instances: [
                    { content: "Hello world" }
                ]
            }
        });

        console.log("Response status:", res.status);
        // console.log("Response data:", JSON.stringify(res.data, null, 2));

        if (res.data && res.data.predictions && res.data.predictions[0]) {
            const embedding = res.data.predictions[0].embeddings.values;
            console.log("Embedding found, length:", embedding.length);
        } else {
            console.log("No embedding in response");
        }

    } catch (e) {
        console.error("Error:", e.message);
        if (e.response) {
            console.error("Response:", e.response.data);
        }
    }
}

testRest();
