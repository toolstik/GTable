class GTable {

    private _dataRange: GoogleAppsScript.Spreadsheet.Range;
    private _values: Object[][];

    options: Options;
    sheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(sheetName: string, options: any) {
        this.options = new Options(options);
        this.sheet = this.options.spreadSheet.getSheetByName(sheetName);
    }

    dataRange() {
        if (this._dataRange !== undefined) return this._dataRange;

        var dataRange = this.sheet.getRange(this.options.offsetA1);
        var firstRow = dataRange.getRow();
        var firstColumn = dataRange.getColumn();
        var lastRow = this.sheet.getLastRow();
        var lastColumn = this.sheet.getLastColumn();

        var numRows = lastRow - firstRow + 1;
        var numColumns = lastColumn - firstColumn + 1;

        if (numRows < 2 || numColumns < 1)
            return (this._dataRange = null);

        let headerOffset = this.options.header ? 1 : 0;

        this._dataRange = dataRange.offset(headerOffset, 0, numRows - headerOffset, numColumns);

        return this._dataRange;
    }

    values() {
        if (this._values !== undefined) return this._values;

        var range = this.dataRange();
        this._values = !range ? [] : range.getValues();

        return this._values;
    }

    static create(sheetName: string, options?: any) {
        return new GTable(sheetName, options);
    }

}