class Options {

    header?: boolean;
    offsetA1?: string;
    spreadSheet?: GoogleAppsScript.Spreadsheet.Spreadsheet;

    fields?: FieldOptions[];

    constructor(options?: Options) {
        if (options)
            Object.assign(this, options);

        this.header = this.header != null ? this.header : true;
        this.offsetA1 = this.offsetA1 || "A1";
        this.spreadSheet = this.spreadSheet || SpreadsheetApp.getActive();
    }

}
