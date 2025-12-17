const pdf = require('pdf-parse');

console.log('Type of pdf export:', typeof pdf);

async function testPdf() {
    const dummyBuffer = Buffer.from('%PDF-1.7\n%\n1 0 obj\n<</Type/Catalog/Pages 2 0 R>>\nendobj\n2 0 obj\n<</Type/Pages/Kids[3 0 R]/Count 1>>\nendobj\n3 0 obj\n<</Type/Page/MediaBox[0 0 595 842]>>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000015 00000 n\n0000000060 00000 n\n0000000111 00000 n\ntrailer\n<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF');

    try {
        const data = await pdf(dummyBuffer);
        console.log('Success!', data.text);
    } catch (e) {
        console.error('Error:', e)
    }
}

testPdf();
