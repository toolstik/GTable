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

    private mapFieldToObject(field: FieldOptions, row: Object[], target: any) {
        const newValue = row[field.columnIndex];
        if (target[field.name] != newValue) {
            target[field.name] = newValue;
            return true;
        }
        return false;
    }

    private mapFieldToRow(field: FieldOptions, obj: any, target: Object[]) {
        const newValue = obj[field.name];
        if (target[field.columnIndex] != newValue) {
            target[field.columnIndex] = newValue;
            return true;
        }
        return false;
    }

    mapToObject(row: Object[]): any {
        if (!this._fields)
            return row;

        return this._fields.reduce((res, fld) => {
            this.mapFieldToObject(fld, row, res);
            return res;
        }, {});
    }

    mapToRow(obj: any, currentRow?: Object[]): { value: Object[], changed: boolean } {
        if (!this._fields)
            return { value: obj, changed: true };

        let changed = false;
        const newRow = currentRow ? currentRow.slice(0) : [];
        const result = this._fields.reduce((res, fld) => {
            const fieldChanged = this.mapFieldToRow(fld, obj, res);
            if (fieldChanged)
                changed = true;
            return res;
        }, newRow);

        return { value: result, changed: changed };
    }
}
