class Mapper {
    private _options: Options;
    private _fields: FieldOptions[];

    constructor(options: Options) {
        this._options = options;
        this._fields = this._initFields();
    }

    private _initFields() {
        if (!this._options.fields) {
            if (!this._options.headers) {
                return null;
            }

            return this._options.headers.map((h, i) => {
                const fld: FieldOptions = {
                    name: h,
                    columnIndex: i,
                    columnName: h
                };
                return fld;
            });
        }

        let headerMap: { [name: string]: number; } = null;
        if (this._options.header && this._options.headers)
            headerMap = this._options.headers.reduce((prev, h, i) => {
                prev[h] = i;
                return prev;
            }, {})

        return this._options.fields.map((fld, i) => {

            if (fld.columnIndex == null) {
                if (!fld.columnName)
                    fld.columnIndex = i;
                else {
                    const ind = headerMap[fld.columnName];
                    if (ind == null)
                        throw new Error(`Column '${fld.columnName}' is not found on data sheet`);
                    fld.columnIndex = ind;
                }
            }

            fld.columnName = this._options.headers ? this._options.headers[fld.columnIndex] : null;
            fld.name = fld.name || fld.columnName;

            if (!fld.name)
                throw new Error(`Unable to get field name with index ${fld.columnIndex}`);

            return fld;
        });
    }

    toObject(row: Object[]): any {
        if (!this._fields)
            return row;

        return this._fields.reduce((prev, fld) => {
            prev[fld.name] = row[fld.columnIndex];
            return prev;
        }, {});
    }

    toRow(obj: any, currentRow?: Object[]) : Object[] {
        if (!this._fields)
            return obj;

        const result = this._fields.reduce((res, fld) =>{
            // todo
            return res;
        }, currentRow || []);

        return result;
    }
}
