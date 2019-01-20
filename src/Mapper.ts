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
                    index: i,
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

            if (fld.index == null) {
                if (!fld.columnName)
                    fld.index = i;
                else {
                    const ind = headerMap[fld.columnName];
                    if (ind == null)
                        throw new Error(`Column '${fld.columnName}' is not found on data sheet`);
                    fld.index = ind;
                }
            }

            fld.columnName = this._options.headers ? this._options.headers[fld.index] : null;
            fld.name = fld.name || fld.columnName;

            if (!fld.name)
                throw new Error(`Unable to get field name with index ${fld.index}`);

            return fld;
        });
    }

    toObject(row: Object[]): any {
        if (!this._options.headers)
            return row;

        return this._fields.reduce((prev, fld) => {
            prev[fld.name] = row[fld.index];
            return prev;
        }, {});
    }
}
