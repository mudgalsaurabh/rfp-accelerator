const { VertexAI } = require('@google-cloud/vertexai');

console.log('Successfully imported VertexAI');

try {
    const vertexAI = new VertexAI({
        project: 'rfp-accelerator-agent',
        location: 'us-central1',
        googleAuthOptions: {
            keyFile: 'service-account-key.json'
        }
    });
    console.log('Successfully initialized VertexAI client');
} catch (e) {
    console.error('Error initializing VertexAI:', e);
}
