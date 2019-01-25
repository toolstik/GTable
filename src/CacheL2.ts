class CacheL2 {
    increment: number;
    minChangedIndex: number;
    maxChangedIndex: number;
    items: { [index: number]: Entity };

    updates: { [index: number]: Entity };
    inserts: Entity[];
    deletes: { [index: number]: Entity };

    private updateCount: number;
    private insertCount: number;
    private deleteCount: number;

    constructor() {
        this.increment = -1;
        this.resetChanges();
    }

    resetChanges() {
        this.minChangedIndex = undefined;
        this.maxChangedIndex = undefined;

        this.updateCount = 0;
        this.insertCount = 0;
        this.deleteCount = 0;

        this.updates = {};
        this.inserts = [];
        this.deletes = {};
    }

    isInsertOnly() {
        return this.insertCount > 0 && this.updateCount == 0 && this.deleteCount == 0;
    }

    hasChanges() {
        return this.insertCount > 0 || this.updateCount > 0 || this.deleteCount > 0;
    }

    setItems(items: Entity[]) {
        if (!items) return;

        this.items = items.reduce((res, i) => {
            res[i.__index] = i;

            if (this.increment == null)
                this.increment = i.__index;
            else
                this.increment = Math.max(this.increment, i.__index);

            return res;
        }, {});
    }

    private updateChangedIndex(i: number) {
        this.minChangedIndex = this.minChangedIndex == undefined ? i : Math.min(this.minChangedIndex, i);
        this.maxChangedIndex = this.maxChangedIndex == undefined ? i : Math.max(this.maxChangedIndex, i);
    }

    save(obj: Entity) {
        if (!obj) return;

        if (obj.__index >= 0) {
            // update
            this.updates[obj.__index] = obj;
            this.updateChangedIndex(obj.__index);
            if (this.items)
                this.items[obj.__index] = obj;
            this.updateCount++;
            //todo update index
        } else {
            // insert
            this.inserts.push(obj);
            if (this.items) {
                this.increment++;
                this.items[this.increment] = obj;
                //todo update index
            }
            this.insertCount++;
        }
    }

    remove(obj: Entity) {
        if (!obj || !(obj.__index >= 0)) return;

        this.deletes[obj.__index] = obj;

        if (this.items)
            delete this.items[obj.__index];
        //todo update index
    }

}