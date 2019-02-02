class Repository {
    private _options: Options;

    private _table: Table;
    private _mapper: Mapper;
    private _cache: CacheL2;

    constructor(options: Options) {
        this._options = new Options(options);
        this._table = new Table(options);
    }

    private mapper() {
        if (this._mapper !== undefined) return this._mapper;

        this._mapper = new Mapper({
            options: this._options,
            headers: this._table.headers()
        });
        return this._mapper;
    }

    static create(options?: Options) {
        return new Repository(options);
    }

    private cache() {
        if (this._cache) return this._cache;
        this._cache = new CacheL2();
        return this._cache;
    }

    private initCache() {
        const cache = this.cache();

        if (!cache.items) {
            const values = this._table.values();
            const mapper = this.mapper();
            const items = values.map((row, i) => mapper.mapToObject(row, i));
            cache.setItems(items);
        }

        return cache;
    }

    findAll() {
        return this.initCache().findAll();
    }

    find(filter: Filter) {
        return this.initCache().find(filter);
    }

    findOne(filter: Filter) {
        return this.initCache().findOne(filter);
    }

    save(obj: Entity) {
        this.cache().save(obj);
    }

    commit() {
        const cache = this.cache();

        if (!cache.hasChanges) return;

        const mapper = this.mapper();
        

        if (cache.isInsertOnly()) {

            const newRows = cache.inserts.map(i => mapper.mapToRow(i).value);
            this._table.append(newRows, []);
            cache.resetChanges();
            return;
        }

        const upsertRows = this._table.values();
        const upsertValues: Object[][] = []

        for (let i = cache.minChangedIndex;
            i <= Math.min(cache.maxChangedIndex, upsertRows.length - 1); i++) {
            const row = upsertRows[i];
            const update = cache.updates.get(i);
            if (update) {
                const mapResult = mapper.mapToRow(update, row);
                const newRow = mapResult.changed ? mapResult.value : row;

                upsertValues.push(newRow);
            }
        }

        const inserts = cache.inserts.map(i => mapper.mapToRow(i).value);
        upsertValues.concat(inserts);

        this._table
            .upsert(upsertValues, cache.minChangedIndex, []);
        cache.resetChanges();
    }

}



