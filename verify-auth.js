const { GoogleAuth } = require('google-auth-library');
const path = require('path');

async function verifyAuth() {
    try {
        const keyPath = path.resolve(__dirname, 'service-account-key.json');
        console.log(`Using Key File at: ${keyPath}`);

        const auth = new GoogleAuth({
            keyFile: keyPath,
            scopes: 'https://www.googleapis.com/auth/cloud-platform'
        });

        console.log("Attempting to get client...");
        const client = await auth.getClient();

        console.log("Attempting to get access token...");
        const token = await client.getAccessToken();

        if (token.token) {
            console.log("✅ SUCCESS: Access Token obtained.");
            console.log(`Token starts with: ${token.token.substring(0, 10)}...`);
        } else {
            console.log("❌ FAILURE: No token returned.");
        }

        const projectId = await auth.getProjectId();
        console.log(`Authenticated Project ID: ${projectId}`);

        // Try a simple API call to verify the project exists/is accessible (e.g., ResourceManager)
        // Or just list locations for Vertex AI
        const location = 'australia-southeast1';
        const baseUrl = `https://${location}-aiplatform.googleapis.com/v1`;

        // 1. List Locations
        console.log(`\n--- Test 1: List Locations ---`);
        const locUrl = `${baseUrl}/projects/${projectId}/locations`;
        try {
            const res = await client.request({ url: locUrl });
            console.log(`✅ Success. Found ${res.data.locations ? res.data.locations.length : 0} locations.`);
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }

        // 2. Get Specific Location
        console.log(`\n--- Test 2: Get Location ${location} ---`);
        const specificLocUrl = `${baseUrl}/projects/${projectId}/locations/${location}`;
        try {
            const res = await client.request({ url: specificLocUrl });
            console.log(`✅ Success. Location Name: ${res.data.name}`);
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
        }

        // 3. List Publisher Models
        console.log(`\n--- Test 3: List Google Models ---`);
        const modelsUrl = `${baseUrl}/projects/${projectId}/locations/${location}/publishers/google/models`;
        try {
            const res = await client.request({ url: modelsUrl });
            console.log(`✅ Success. Found ${res.data.models ? res.data.models.length : 0} models.`);
            if (res.data.models) {
                const flash = res.data.models.find(m => m.name.includes('gemini-1.5-flash-001'));
                console.log(`   gemini-1.5-flash-001 found: ${flash ? 'YES' : 'NO'}`);

                const embedding = res.data.models.find(m => m.name.includes('gemini-embedding-001'));
                console.log(`   gemini-embedding-001 found: ${embedding ? 'YES' : 'NO'}`);
            }
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
            if (e.response) {
                console.log(`   Status: ${e.response.status}`);
                console.log(`   Data: ${JSON.stringify(e.response.data)}`);
            }
        }

        // 4. Test Predict (Raw REST)
        console.log(`\n--- Test 4: Predict (gemini-1.5-flash-001) ---`);
        const predictUrl = `${baseUrl}/projects/${projectId}/locations/${location}/publishers/google/models/gemini-1.5-flash-001:generateContent`;
        try {
            const res = await client.request({
                url: predictUrl,
                method: 'POST',
                data: {
                    contents: [{ role: 'user', parts: [{ text: 'Hi' }] }]
                }
            });
            console.log(`✅ Success. Response received.`);
        } catch (e) {
            console.log(`❌ Failed: ${e.message}`);
            if (e.response) {
                console.log(`   Status: ${e.response.status}`);
                console.log(`   Data: ${JSON.stringify(e.response.data)}`);
            }
        }

    } catch (e) {
        console.error("❌ ERROR:", e.message);
        if (e.response) {
            console.error("Response Status:", e.response.status);
            console.error("Response Data:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

verifyAuth();
