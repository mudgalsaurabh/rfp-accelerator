import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export interface RfpResult {
    question: string;
    answer: string;
    sources?: string[];
}

export async function generateRfpDocx(results: RfpResult[]): Promise<Buffer> {
    const doc = new Document({
        sections: [
            {
                properties: {},
                children: [
                    new Paragraph({
                        text: "RFP Analysis Results",
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 400 },
                    }),
                    ...results.flatMap((res, index) => [
                        new Paragraph({
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
                        }),
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: "Answer:",
                                    bold: true,
                                    italics: true,
                                    color: "2E74B5",
                                }),
                            ],
                            spacing: { after: 100 },
                        }),
                        new Paragraph({
                            text: res.answer,
                            spacing: { after: 200 },
                        }),
                        ...(res.sources && res.sources.length > 0 ? [
                            new Paragraph({
                                children: [
                                    new TextRun({
                                        text: "Sources: ",
                                        bold: true,
                                        size: 18,
                                        color: "888888",
                                    }),
                                    new TextRun({
                                        text: res.sources.join(", "),
                                        size: 18,
                                        color: "888888",
                                    }),
                                ],
                                spacing: { after: 400 },
                            })
                        ] : []),
                        new Paragraph({
                            border: {
                                bottom: {
                                    color: "DDDDDD",
                                    space: 1,
                                    style: "single",
                                    size: 6,
                                },
                            },
                        }),
                    ]),
                ],
            },
        ],
    });

    return await Packer.toBuffer(doc);
}
