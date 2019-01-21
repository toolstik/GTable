class Options {

    header: boolean = true;
    headers: string[];
    offsetA1: string = "A1";
    spreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet;

    fields: FieldOptions[];

    constructor(options: any) {
        options = options || {};
        this.header = options.header != null ? options.header : true;
        this.offsetA1 = options.offsetA1 || "A1";
        this.spreadSheet = options.spreadSheet || SpreadsheetApp.getActive();
        this.fields = options.fields;
    }

}

class FieldOptions {
    name: string;
    columnIndex?: number;
    columnName?: string;

    static IndexField: FieldOptions = {
        name: "__index"
    };

}
