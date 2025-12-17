const { GoogleAuth } = require('google-auth-library');

async function listModels() {
    console.log("Authenticating...");
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
        keyFile: 'service-account-key.json'
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    const location = 'us-central1';

    console.log(`Project ID: ${projectId}`);
    console.log(`Location: ${location}`);

    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models`;

    console.log(`Requesting URL: ${url}`);

    try {
        const res = await client.request({
            url,
            method: 'GET'
        });

        console.log("Request successful!");
        const models = res.data.models;
        if (models && models.length > 0) {
            console.log(`Found ${models.length} models.`);
            console.log("First 5 models:");
            models.slice(0, 5).forEach(m => console.log(` - ${m.name} (${m.versionId})`));

            // Check specifically for gemini
            const geminiModels = models.filter(m => m.name.includes('gemini'));
            console.log(`\nFound ${geminiModels.length} Gemini models:`);
            geminiModels.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log("No models found (empty list returned).");
        }
    } catch (e) {
        console.log("Request Failed!");
        console.log(`Status: ${e.response ? e.response.status : 'Unknown'}`);
        console.log(`Status Text: ${e.response ? e.response.statusText : 'Unknown'}`);
        if (e.response && e.response.data) {
            console.log("Error Data:", JSON.stringify(e.response.data, null, 2));
        } else {
            console.log("Error:", e.message);
        }
    }
}

listModels();
