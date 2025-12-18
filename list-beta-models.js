const { GoogleAuth } = require('google-auth-library');

async function listModelsBeta() {
    console.log("Authenticating...");
    const auth = new GoogleAuth({
        scopes: 'https://www.googleapis.com/auth/cloud-platform',
        keyFile: 'service-account-key.json'
    });

    const client = await auth.getClient();
    const projectId = await auth.getProjectId();
    const location = 'us-central1'; // Start with us-central1 for listing

    console.log(`Project: ${projectId}`);

    const url = `https://${location}-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/${location}/publishers/google/models`;

    console.log(`URL: ${url}`);

    try {
        const res = await client.request({ url, method: 'GET' });
        console.log("Success!");
        console.log("Models found:", res.data.models ? res.data.models.length : 0);
        if (res.data.models) {
            res.data.models.slice(0, 10).forEach(m => console.log(` - ${m.name}`));
        }
    } catch (e) {
        console.log("Failed!");
        console.log("Status:", e.response ? e.response.status : 'Unknown');
        if (e.response) console.log("Data:", JSON.stringify(e.response.data, null, 2));
    }
}

listModelsBeta();
