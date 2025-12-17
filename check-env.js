const fs = require('fs');
const path = require('path');

function parseEnv(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf8');
    const result = {};
    content.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            result[key] = value;
        }
    });
    return result;
}

const envLocal = parseEnv('.env.local');

console.log("Checking keys in .env.local...");
const keysToCheck = [
    'GOOGLE_APPLICATION_CREDENTIALS',
    'GOOGLE_API_KEY',
    'GOOGLE_PROJECT_ID',
    'GOOGLE_CLIENT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'NEXT_PUBLIC_GEMINI_API_KEY',
    'GEMINI_API_KEY'
];

keysToCheck.forEach(key => {
    if (envLocal[key]) {
        console.log(`Found ${key}: Yes (Length: ${envLocal[key].length})`);
        if (key === 'GOOGLE_APPLICATION_CREDENTIALS') {
            console.log(`  Value indicates file path: ${envLocal[key]}`);
            if (fs.existsSync(envLocal[key])) {
                console.log(`  File exists: Yes`);
            } else {
                console.log(`  File exists: No`);
            }
        }
    } else {
        console.log(`Found ${key}: No`);
    }
});

if (fs.existsSync('service-account-key.json')) {
    console.log("Found service-account-key.json in root: Yes");
} else {
    console.log("Found service-account-key.json in root: No");
}
