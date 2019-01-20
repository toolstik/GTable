class GTable {

    private _dataRange: GoogleAppsScript.Spreadsheet.Range;
    private _headers: string[];
    private _values: Object[][];

    options: Options;
    sheet: GoogleAppsScript.Spreadsheet.Sheet;

    constructor(sheetName: string, options: any) {
        this.options = new Options(options);
        this.sheet = this.options.spreadSheet.getSheetByName(sheetName);
    }

    private read() {
        const dataRange = this.sheet.getRange(this.options.offsetA1);
        const firstRow = dataRange.getRow();
        const firstColumn = dataRange.getColumn();
        const lastRow = this.sheet.getLastRow();
        const lastColumn = this.sheet.getLastColumn();

        const numRows = lastRow - firstRow + 1;
        const numColumns = lastColumn - firstColumn + 1;

        if (numRows < 1 || numColumns < 1) {
            this._dataRange = null;
            this._headers = null;
            this._values = [];
            return;
        }

        this._dataRange = dataRange.offset(0, 0, numRows, numColumns);

        const data = this._dataRange.getValues();
        this._headers = this.options.header ? data.shift().map(h => h.toString()) : null;
        this._values = data;
    }

    dataRange() {
        if (this._dataRange === undefined)
            this.read();
        return this._dataRange;
    }

    values() {
        if (this._values === undefined)
            this.read();
        return this._values;
    }

    headers() {
        if (this._headers === undefined)
            this.read();
        return this._headers;
    }

    static create(sheetName: string, options?: any) {
        return new GTable(sheetName, options);
    }

    private createItem(row: Object[]): any {
        return this.headers().reduce((prev, cur, i) => {
            prev[cur] = row[i];
            return prev;
        }, {});
    }

    findAll() {
        return this.values()
            .map(row => this.createItem(row));
    }

}