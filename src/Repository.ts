class Repository {
    private _options: Options;

    private _table: Table;
    private _mapper: Mapper;
    private _cache: CacheL2;

    constructor(sheetName: string, options: Options) {
        this._options = new Options(options);
        this._table = new Table(sheetName, options);
        this._cache = new CacheL2();
    }

    private mapper() {
        if (this._mapper !== undefined) return this._mapper;

        this._mapper = new Mapper({
            options: this._options,
            headers: this._table.headers()
        });
        return this._mapper;
    }

    static create(sheetName: string, options?: Options) {
        return new Repository(sheetName, options);
    }

    private items() {
        if (!this._cache.items) {
            const values = this._table.values();
            const mapper = this.mapper();
            const items = values.map((row, i) => mapper.mapToObject(row, i));
            this._cache.setItems(items);
        }
        return Object.values(this._cache.items);
    }

    findAll() {
        return this.items();
    }

    save(obj: Model) {
        this._cache.save(obj);
    }

    commit() {

        if (!this._cache.hasChanges) return;

        const mapper = this.mapper();

        if (this._cache.isInsertOnly()) {

            const newRows = this._cache.inserts.map(i => mapper.mapToRow(i).value);
            this._table.append(newRows, mapper.formulaColumns(newRows.length));
            this._cache.resetChanges();
            return;
        }

        const upsertRows = this._table.values();
        const upsertValues: Object[][] = []

        for (let i = this._cache.minChangedIndex;
            i <= Math.min(this._cache.maxChangedIndex, upsertRows.length - 1); i++) {
            const row = upsertRows[i];
            const update = this._cache.updates[i]
            const newRow = update ? mapper.mapToRow(update, row).value : row;

            upsertValues.push(newRow);
        }

        const inserts = this._cache.inserts.map(i => mapper.mapToRow(i).value);
        upsertValues.concat(inserts);

        this._table
            .upsert(upsertValues, this._cache.minChangedIndex, mapper.formulaColumns(upsertValues.length));
        this._cache.resetChanges();
    }

}