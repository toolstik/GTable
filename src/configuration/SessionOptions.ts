class SessionOptions {
    entities?: {
        [entity: string]: Options;
    };

    constructor(options?: SessionOptions) {
        if (options)
            Object.assign(this, options);

        this.entities = this.entities || SessionOptions.defaultEntities();
    }

    private static defaultEntities() {
        const spreadsheet = SpreadsheetApp.getActive();
        const sheets = spreadsheet.getSheets();

        let result: { [entity: string]: Options; } = {};

        sheets.forEach(s => {
            const sheetName = s.getName();
            result[sheetName] = {
                sheetName: sheetName,
                sheet: s
            };
        });

        return result;
    }
}