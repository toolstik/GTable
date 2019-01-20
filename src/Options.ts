class Options {

    header: boolean;
    headers: string[];
    offsetA1: string;
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

    constructor(options: any) {
        options = options || {};
        this.header = options.header != null ? options.header : true;
        this.offsetA1 = options.offsetA1 || "A1";
        this.spreadSheet = options.spreadSheet || SpreadsheetApp.getActive();
    }
}
