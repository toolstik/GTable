class GTable {

    private _dataRange: GoogleAppsScript.Spreadsheet.Range;
    private _options: Options;
    private _sheet: GoogleAppsScript.Spreadsheet.Sheet;
    private _mapper: Mapper;
    private _values: Object[][];

    constructor(sheetName: string, options: any) {
        this._options = new Options(options);
        this._sheet = this._options.spreadSheet.getSheetByName(sheetName);
    }

    private read() {
        const offsetRange = this._sheet.getRange(this._options.offsetA1);
        const sheetDataRange = this._sheet.getDataRange();
        const firstRow = offsetRange.getRow();
        const firstColumn = offsetRange.getColumn();
        const lastRow = sheetDataRange.getLastRow();
        const lastColumn = sheetDataRange.getLastColumn();

        const numRows = lastRow - firstRow + 1;
        const numColumns = lastColumn - firstColumn + 1;

        if (numRows < 1 || numColumns < 1
            //empty sheet case
            || (numRows == 1 && numColumns == 1 && offsetRange.getCell(1, 1).isBlank())) {
            this._dataRange = null;
            this._values = [];
            return;
        }

        this._dataRange = offsetRange.offset(0, 0, numRows, numColumns);

        const data = this._dataRange.getValues();
        this._options.headers = this._options.header ? data.shift().map(h => h.toString()) : null;
        this._mapper = new Mapper(this._options);

        this._values = data;
    }

    static create(sheetName: string, options?: any) {
        return new GTable(sheetName, options);
    }

    private items() {
        if (this._values === undefined)
            this.read();
        return this._values.map(row => this._mapper.toObject(row));
    }

    findAll() {
        return this.items();
    }

    save(obj:any){
        
    }

    commit(){

    }

}

