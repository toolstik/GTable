class Mapper {
    private _options: Options;
    private _fields: FieldOptions[];
    private _headers: string[];

    constructor(options: {
        options: Options,
        headers: string[]
    }) {
        this._options = options.options;
        this._headers = options.headers;

        this._fields = this.fields();
    }

    private fields() {
        if (this._fields !== undefined) return this._fields;

        if (!this._options.fields) {
            if (!this._headers)
                throw new Error(`Unable to get fields list`);

            this._fields = this._headers.map((h, i) => {
                const fld: FieldOptions = {
                    name: h,
                    columnIndex: i,
                    columnName: h
                };
                return fld;
            });
            return this._fields;
        }

        let headerMap: { [name: string]: number; } = null;
        if (this._options.header && this._headers)
            headerMap = this._headers.reduce((prev, h, i) => {
                prev[h] = i;
                return prev;
            }, {})

        this._fields = this._options.fields.map((fld, i) => {

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

            fld.columnName = this._headers ? this._headers[fld.columnIndex] : null;
            fld.name = fld.name || fld.columnName;

            if (!fld.name)
                throw new Error(`Unable to get field name with index ${fld.columnIndex}`);

            if (fld.readonly == null)
                fld.readonly = false;

            return fld;
        });
        return this._fields;
    }

    private mapFieldToObject(field: FieldOptions, row: Object[], target: Entity) {
        let newValue = row[field.columnIndex];

        if (newValue == "" && field.default != null)
            newValue = field.default;

        if (target[field.name] != newValue) {
            target[field.name] = newValue;
            return true;
        }
        return false;
    }

    private mapFieldToRow(field: FieldOptions, obj: Entity, target: Object[]) {
        if (field.readonly)
            return false;

        const newValue = field.formula ? field.formula : obj[field.name];
        if (target[field.columnIndex] != newValue) {
            target[field.columnIndex] = newValue;
            return true;
        }
        return false;
    }

    mapToObject(row: Object[], index: number): Entity {
        let result: Entity = { __index: index };
        result = this.fields().reduce((res, fld) => {
            this.mapFieldToObject(fld, row, res);
            return res;
        }, result);

        return result;
    }

    mapToRow(obj: Entity, currentRow?: Object[]): { value: Object[], changed: boolean } {
        let changed = false;
        const newRow = currentRow ? currentRow.slice(0) : [];
        const result = this.fields().reduce((res, fld) => {
            const fieldChanged = this.mapFieldToRow(fld, obj, res);
            if (fieldChanged)
                changed = true;
            return res;
        }, newRow);

        return { value: result, changed: changed };
    }

    formulaColumns(rowsCount: number) {
        const result: string[][][] = [];
        for (let field of this.fields()) {
            if (field.formula != null) {
                const column: string[][] = [];
                for (let i = 0; i < rowsCount; i++)
                    column[i] = [field.formula];

                result[field.columnIndex] = column;
            } else
                result[field.columnIndex] = null;
        }
        return result;
    }
}
