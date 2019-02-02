class SessionOptions {
    entities?: {
        [entity: string]: Options;
    };

    constructor(options?: SessionOptions) {
        if (options)
            Object.assign(this, options);

        if (this.entities) {
            for (let entity in this.entities) {
                const opts = this.entities[entity];

                if (opts.sheet == null && !opts.sheetName)
                    opts.sheetName = entity;

                this.entities[entity] = opts;
            }
        }
        else
            this.entities = SessionOptions.defaultEntities();
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