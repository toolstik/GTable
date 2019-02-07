class Options {

    header?: boolean;
    offsetA1?: string;

    /**
     * Set to 'true' if sure that first row and first column of dataset do not contain empty cells. Lazy scan strategy is much faster than greedy one. Default is false
     */
    rangeScanLazy?: boolean;

    /**
     * Field indexing toggle
     */
    index?: boolean;

    sheetName?: string;
    sheet?: GoogleAppsScript.Spreadsheet.Sheet;

    fields?: FieldOptions[];

    constructor(options?: Options) {
        if (options)
            Object.assign(this, options);

        this.header = this.header != null ? this.header : true;
        this.offsetA1 = this.offsetA1 || "A1";
        this.index = this.index != null ? this.index : true;
        this.rangeScanLazy = this.rangeScanLazy != null ? this.rangeScanLazy : false;

        if (this.sheetName == null) {
            if (this.sheet == null)
                throw new Error(`Neither the sheet name nor the sheet specified`);

            this.sheetName = this.sheet.getName();
        }

        this.sheet = this.sheet || SpreadsheetApp.getActive().getSheetByName(this.sheetName);
    }

}


