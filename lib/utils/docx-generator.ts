import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

export interface RfpResult {
    question: string;
    answer: string;
    sources?: string[];
}

export async function generateRfpDocx(results: RfpResult[], originalText?: string): Promise<Buffer> {
    const children: Paragraph[] = [];

    if (originalText) {
        // "Write-Back" Mode: Preserve original text and insert answers
        const lines = originalText.split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Add the original line
            children.push(new Paragraph({
                text: trimmed,
                spacing: { before: 200, after: 100 }
            }));

            // Check if this line matches any detected question
            const matchingResult = results.find(r => r.question.trim().toLowerCase() === trimmed.toLowerCase());

            if (matchingResult) {
                // Insert AI Answer immediately after the question
                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: "AI RESPONSE:",
                            bold: true,
                            color: "4f46e5", // Match brand Indigo
                            size: 20,
                        }),
                    ],
                    spacing: { before: 0, after: 100 },
                }));

                children.push(new Paragraph({
                    children: [
                        new TextRun({
                            text: matchingResult.answer,
                            italics: true,
                            color: "64748b", // Slate 500
                        }),
                    ],
                    spacing: { after: 300 },
                }));

                if (matchingResult.sources && matchingResult.sources.length > 0) {
                    children.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: `Sources: ${matchingResult.sources.join(", ")}`,
                                size: 16,
                                color: "94a3b8",
                            }),
                        ],
                        spacing: { after: 200 },
                    }));
                }
            }
        }
    } else {
        // Fallback: Just a list of Q&A
        children.push(new Paragraph({
            text: "RFP Analysis Results",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
        }));

        results.forEach((res, index) => {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: `Question ${index + 1}: `,
                        bold: true,
                        size: 24,
                    }),
                    new TextRun({
                        text: res.question,
                        size: 24,
                    }),
                ],
                spacing: { before: 400, after: 200 },
            }));

            children.push(new Paragraph({
                text: res.answer,
                spacing: { after: 200 },
            }));
        });
    }

    const doc = new Document({
        sections: [
            {
                properties: {},
                children: children,
            },
        ],
    });

    return await Packer.toBuffer(doc);
}
