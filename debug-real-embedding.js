// Logic Test

// Mock typescript build context by registering ts-node or just simply expecting it to work if compiled? 
// No, this environment is node, and embeddings.ts is TS.
// I cannot require .ts files directly in node without ts-node.

// I will write a small script that basically copies the logic of generateEmbedding but in JS
// to verify the logic strictly.

async function testRealEmbedding() {
    try {
        console.log("Testing generateEmbedding logic...");

        // Logic from lib/rag/embeddings.ts
        const { GoogleAuth } = require('google-auth-library');
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
            keyFile: 'service-account-key.json'
        });
        const client = await auth.getClient();
        const projectId = await auth.getProjectId();
        const location = 'australia-southeast1';
        const modelId = 'gemini-embedding-001';
        const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predict`;

        console.log(`URL: ${url}`);

        const res = await client.request({
            url,
            method: 'POST',
            data: {
                instances: [{ content: "Hello World" }]
            }
        });

        console.log("Response Status:", res.status);
        console.log("Response Data keys:", Object.keys(res.data));

        // @ts-ignore
        const embeddings = res.data?.predictions?.[0]?.embeddings?.values;
        if (embeddings) {
            console.log(`✅ Success! Embedding length: ${embeddings.length}`);
        } else {
            console.log("❌ Failed: No embeddings in response.");
            console.log(JSON.stringify(res.data, null, 2));
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
        if (e.response) {
            console.error("Status:", e.response.status);
            console.error("Data:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

testRealEmbedding();
