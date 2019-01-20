class GTable {

    private _dataRange: GoogleAppsScript.Spreadsheet.Range;
    private _options: Options;
    private _sheet: GoogleAppsScript.Spreadsheet.Sheet;
    private _mapper: Mapper;
    private _items: any[];

    constructor(sheetName: string, options: any) {
        this._options = new Options(options);
        this._sheet = this._options.spreadSheet.getSheetByName(sheetName);
    }

    private read() {
        const dataRange = this._sheet.getRange(this._options.offsetA1);
        const firstRow = dataRange.getRow();
        const firstColumn = dataRange.getColumn();
        const lastRow = this._sheet.getLastRow();
        const lastColumn = this._sheet.getLastColumn();

        const numRows = lastRow - firstRow + 1;
        const numColumns = lastColumn - firstColumn + 1;

        if (numRows < 1 || numColumns < 1) {
            this._dataRange = null;
            this._items = [];
            return;
        }

        this._dataRange = dataRange.offset(0, 0, numRows, numColumns);

        const data = this._dataRange.getValues();
        this._options.headers = this._options.header ? data.shift().map(h => h.toString()) : null;
        this._mapper = new Mapper(this._options);

        this._items = data.map(row => this._mapper.toObject(row));
    }

    static create(sheetName: string, options?: any) {
        return new GTable(sheetName, options);
    }

    private items() {
        if (this._items === undefined)
            this.read();
        return this._items;
    }

    findAll() {
        return this.items();
    }

}

