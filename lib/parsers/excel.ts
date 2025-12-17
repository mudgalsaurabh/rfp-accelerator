import * as XLSX from 'xlsx';

export async function parseExcel(buffer: Buffer): Promise<string> {
    try {
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        let text = '';

        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            text += `Sheet: ${sheetName}\n`;
            data.forEach((row: any) => {
                text += row.join(' ') + '\n';
            });
            text += '\n';
        });

        return text;
    } catch (error) {
        console.error('Error parsing Excel:', error);
        throw new Error('Failed to parse Excel document');
    }
}
