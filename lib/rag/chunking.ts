export function chunkText(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
    const chunks: string[] = [];
    let startIndex = 0;

    while (startIndex < text.length) {
        let endIndex = startIndex + chunkSize;

        // Attempt to break at a newline or period if possible to avoid cutting words
        if (endIndex < text.length) {
            const nextNewLine = text.indexOf('\n', endIndex);
            const nextPeriod = text.indexOf('.', endIndex);

            if (nextNewLine !== -1 && nextNewLine < endIndex + 100) {
                endIndex = nextNewLine + 1;
            } else if (nextPeriod !== -1 && nextPeriod < endIndex + 100) {
                endIndex = nextPeriod + 1;
            }
        }

        chunks.push(text.slice(startIndex, endIndex));
        startIndex = endIndex - overlap;
    }

    return chunks;
}
