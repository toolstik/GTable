class CacheL2 {
    increment: number;
    minChangedIndex: number;
    maxChangedIndex: number;
    items: EntityCollection;

    updates: EntityCollection;
    inserts: Entity[];
    deletes: EntityCollection;

    private updateCount: number;
    private insertCount: number;
    private deleteCount: number;

    private _indexes: {
        [field: string]: Index
    };

    constructor(private options: Options) {
        this.increment = -1;
        this.resetChanges();
    }

    resetChanges() {
        this.minChangedIndex = undefined;
        this.maxChangedIndex = undefined;

        this.updateCount = 0;
        this.insertCount = 0;
        this.deleteCount = 0;

        this.updates = new EntityCollection();
        this.inserts = [];
        this.deletes = new EntityCollection();
    }

    isInsertOnly() {
        return this.insertCount > 0 && this.updateCount == 0 && this.deleteCount == 0;
    }

    hasChanges() {
        return this.insertCount > 0 || this.updateCount > 0 || this.deleteCount > 0;
    }

    private indexesEnabled() {
        return this.options.index == true;
    }

    private indexes() {
        if (!this.indexesEnabled())
            return null;
        if (!this._indexes)
            this._indexes = {};
        return this._indexes;
    }

    private updateIndexes(item: Entity) {
        if (!this.indexesEnabled())
            return;
        for (let field in item) {
            this.updateIndex(field, item);
        }
    }

    private updateIndex(field: string, newValue: Entity, oldValue?: Entity) {
        if (!this.indexesEnabled())
            return null;
            
        const indexes = this.indexes();
        const fieldIndex = indexes[field] || (indexes[field] = new Index());

        if (oldValue)
            fieldIndex.delete(oldValue[field], oldValue);

        if (newValue)
            fieldIndex.update(newValue[field], newValue);

        return fieldIndex;
    }

    setItems(items: Entity[]) {
        if (!items) return;

        this.items = new EntityCollection();

        for (let i of items) {
            this.items.update(i);
            this.updateIndexes(i);

            if (this.increment == null)
                this.increment = i.__index;
            else
                this.increment = Math.max(this.increment, i.__index);
        }
    }

    private updateChangedIndex(i: number) {
        this.minChangedIndex = this.minChangedIndex == undefined ? i : Math.min(this.minChangedIndex, i);
        this.maxChangedIndex = this.maxChangedIndex == undefined ? i : Math.max(this.maxChangedIndex, i);
    }

    save(obj: Entity) {
        if (!obj) return;

        if (obj.__index >= 0) {
            // update
            this.updates.update(obj);
            this.updateChangedIndex(obj.__index);
            if (this.items)
                this.items.update(obj);
            this.updateCount++;
            //todo update index
        } else {
            // insert
            this.inserts.push(obj);
            if (this.items) {
                this.increment++;
                obj.__index = this.increment;
                this.items.update(obj);
                //todo update index
            }
            this.insertCount++;
        }
    }

    remove(obj: Entity) {
        if (!obj || !(obj.__index >= 0)) return;

        this.deletes.update(obj);

        if (this.items)
            this.items.delete(obj.__index);
        //todo update index
    }

    private values() {
        return this.items.values();
    }

    findAll() {
        return this.values();
    }

    find(filter: Filter) {
        if (filter == null) return [];

        if (this.indexesEnabled()) {
            const indexes = this.indexes();

            return Object.keys(filter)
                .map(f => indexes[f] ? indexes[f].get(filter[f]) : new EntityCollection())
                .reduce((res, cur) => {
                    return EntityCollection.intersect(res, cur);
                })
                .values();
        }

        return this.values().filter(i => this.applyFilter(i, filter));
    }

    findOne(filter: Filter) {
        const findResult = this.find(filter);

        if (findResult.length > 1)
            throw new Error(`The result contains more than 1 element (${findResult.length})`);

        return findResult[0];
    }

    private applyFilter(entity: Entity, filter: Filter) {
        let apply = true;
        for (let field in filter) {
            if (filter[field] != entity[field]) {
                apply = false;
                break;
            }
        }
        return apply;
    }

}