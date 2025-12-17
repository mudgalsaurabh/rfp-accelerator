// @ts-ignore
if (typeof Promise.withResolvers === 'undefined') {
    // Polyfill if needed for newer Node, but DOMMatrix is the issue
}
// @ts-ignore
if (typeof global.DOMMatrix === 'undefined') {
    // @ts-ignore
    global.DOMMatrix = class DOMMatrix {
        constructor() {
            // @ts-ignore
            this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
        }
        is2D = true;
        isIdentity = true;
        translate() { return this; }
        scale() { return this; }
        rotate() { return this; }
        multiply() { return this; }
        transformPoint(p: any) { return p; }
        inverse() { return this; }
    };
}

const pdfLib = require('pdf-parse');


export async function parsePdf(buffer: Buffer): Promise<string> {
    try {
        const data = await pdfLib(buffer);
        return data.text;
    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error(`Failed to parse PDF document: ${(error as Error).message}`);
    }
}
