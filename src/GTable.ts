class GTable {
    private _options: Options;
    private _sheet: GoogleAppsScript.Spreadsheet.Sheet;
    private _mapper: Mapper;
    private _headers: string[];
    private _values: Object[][];

    private _storageMeta: {
        dataRange: GoogleAppsScript.Spreadsheet.Range;
        headers?: string[];
        columnsCount: number;
    };

    private _changes: number[];

    constructor(sheetName: string, options: any) {
        this._options = new Options(options);
        this._sheet = this._options.spreadSheet.getSheetByName(sheetName);
        this._changes = [];
    }

    private storageMeta() {
        if (this._storageMeta !== undefined) return this._storageMeta;

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
            this._storageMeta = {
                dataRange: null,
                columnsCount: 0
            }
            return this._storageMeta;
        }

        this._storageMeta = {
            dataRange: offsetRange.offset(0, 0, numRows, numColumns),
            columnsCount: numColumns
        };

        return this._storageMeta;
    }

    private values() {
        if (this._values !== undefined) return this._values;

        const meta = this.storageMeta();

        if (!meta.dataRange)
            return (this._values = []);

        const data = meta.dataRange.getValues();
        this._headers = this._headers || (this._options.header ? data.shift().map(h => h.toString()) : null);
        this._values = data;
        return this._values;
    }

    private headers() {
        if (this._headers !== undefined) return this._headers;

        if (!this._options.header)
            return (this._headers = null);

        const meta = this.storageMeta();

        if (!meta.dataRange)
            return (this._headers = null);

        this._headers = meta.dataRange.offset(0, 0, 1, meta.columnsCount).getValues()[0].map(h => h.toString());
        return this._headers;
    }

    private mapper() {
        if (this._mapper !== undefined) return this._mapper;

        this._mapper = new Mapper({
            options: this._options,
            headers: this.headers()
        });
        return this._mapper;
    }

    static create(sheetName: string, options?: any) {
        return new GTable(sheetName, options);
    }

    private items() {
        const values = this.values();
        const mapper = this.mapper();
        return values.map(row => mapper.mapToObject(row));
    }

    findAll() {
        return this.items();
    }

    save(obj: any) {
        if (!obj) return;

        const index = obj[FieldOptions.IndexField().name];

        if (index >= 0) {
            // update
            const current = this._values[index];
            const mapResult = this._mapper.mapToRow(obj, current);

            if (mapResult.changed) {
                this._values[index] = mapResult.value;
                this._changes.push(index);
            }

        } else {
            // insert
            const mapResult = this._mapper.mapToRow(obj);
            const newIndex = this._values.push(mapResult.value) - 1;
            this._changes.push(newIndex);
        }
    }

    commit() {
        const meta = this.storageMeta();
        const range = meta.dataRange.offset(this._options.header ? 1 : 0, 0, this._values.length, meta.columnsCount);
        range.setValues(this._values);
        this._changes = [];
    }

}

