class SessionOptions {

    defaults?: Options;
    entities?: {
        [entity: string]: Options;
    };

    constructor(options?: SessionOptions) {
        if (options)
            Object.assign(this, options);

        this.defaults = this.defaults || {};
        this.defaults.spreadsheet = this.defaults.spreadsheet || SpreadsheetApp.getActive();

        if (this.entities) {
            for (let entity in this.entities) {
                const opts = this.entities[entity];

                if (opts.sheet == null && !opts.sheetName)
                    opts.sheetName = entity;

                opts.spreadsheet = opts.spreadsheet || this.defaults.spreadsheet;
                opts.rangeScanLazy = opts.rangeScanLazy == null
                    ? this.defaults.rangeScanLazy
                    : opts.rangeScanLazy;
                opts.index = opts.index == null ? this.defaults.index : opts.index;

                this.entities[entity] = opts;
            }
        }
    }

    static getEntityOptions(options: SessionOptions, name: string) {
        if (options.entities) {
            const defined = options.entities[name];

            if (defined)
                return defined;
        }
        
        const sheet = options.defaults.spreadsheet.getSheetByName(name);

        if (!sheet) return null;

        return {
            ...options.defaults,
            sheetName: name,
            sheet: sheet
        };
    }
}