class Table {
    private _options: Options;
    private _headers: string[];
    private _values: Object[][];

    private _storageMeta: {
        dataRange: GoogleAppsScript.Spreadsheet.Range;
        headers?: string[];
        columnsCount: number;
        rowsCount: number;
    };

    constructor(options: Options) {
        this._options = new Options(options);
    }

    private storageMeta() {
        if (this._storageMeta !== undefined)
            return this._storageMeta;

        const offsetRange = this._options.sheet.getRange(this._options.offsetA1);
        const sheetDataRange = this._options.sheet.getDataRange();
        const firstRow = offsetRange.getRow();
        const firstColumn = offsetRange.getColumn();
        const lastRow = sheetDataRange.getLastRow();
        const lastColumn = sheetDataRange.getLastColumn();

        const numRows = lastRow - firstRow + 1;
        const numColumns = lastColumn - firstColumn + 1;

        if (numRows < 1 || numColumns < 1
            //empty sheet case
            || (numRows == 1 && numColumns == 1 && offsetRange.getCell(1, 1).isBlank())) {
            this._storageMeta = {
                dataRange: null,
                columnsCount: 0,
                rowsCount: 0
            };
            return this._storageMeta;
        }

        this._storageMeta = {
            dataRange: offsetRange.offset(0, 0, numRows, numColumns),
            columnsCount: numColumns,
            rowsCount: numRows
        };

        return this._storageMeta;
    }

    values() {
        if (this._values !== undefined)
            return this._values;

        const meta = this.storageMeta();
        if (!meta.dataRange)
            return (this._values = []);

        const data = meta.dataRange.getValues();
        const headers = this._options.header ? data.shift().map(h => h.toString()) : null;
        this._headers = this._headers || headers;
        this._values = data;

        return this._values;
    }

    headers() {
        if (this._headers !== undefined)
            return this._headers;

        if (!this._options.header)
            return (this._headers = null);

        const meta = this.storageMeta();
        if (!meta.dataRange)
            return (this._headers = null);

        this._headers = meta.dataRange.offset(0, 0, 1, meta.columnsCount).getValues()[0].map(h => h.toString());
        return this._headers;
    }

    private writeFormulas(range: GoogleAppsScript.Spreadsheet.Range, formulaSections: string[][][]) {
        if (!formulaSections || formulaSections.length == 0)
            return;

        for (let i = 0; i < formulaSections.length; i++) {
            const data = formulaSections[i];
            if(!data) continue;
            range.offset(0, i, range.getNumRows(), data[0].length).setFormulasR1C1(data);
        }
    }

    append(rows: Object[][], formulaSections: string[][][]) {
        if (!rows || !(rows.length > 0)) return;
        const meta = this.storageMeta();
        this.upsert(rows, meta.rowsCount - (this._options.header ? 1 : 0), formulaSections);
    }

    upsert(rows: Object[][], startIndex: number, formulaSections: string[][][]) {
        if (!rows || !(rows.length > 0) || startIndex < 0) return;

        const meta = this.storageMeta();
        const rowOffset = startIndex + (this._options.header ? 1 : 0);

        if (rowOffset > meta.rowsCount)
            throw new Error('Insert produces blank rows');

        const range = meta.dataRange.offset(rowOffset, 0, rows.length, meta.columnsCount);
        range.setValues(rows);
        this.writeFormulas(range, formulaSections);
        meta.rowsCount = Math.max(rowOffset + rows.length, meta.rowsCount);
        meta.dataRange = meta.dataRange.offset(0, 0, meta.rowsCount, meta.columnsCount);
    }
}
