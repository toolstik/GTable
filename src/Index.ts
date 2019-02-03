class Index {
    private _data: { [value: string]: EntityCollection };

    constructor() {
        this._data = {};
    }

    items(key: any) {
        return this.get(key).values();
    }

    get(key: any): EntityCollection {
        const strKey = JSON.stringify(key);
        return this._data[strKey] || (this._data[strKey] = new EntityCollection());
    }

    update(key: any, obj: Entity) {
        const collection = this.get(key);
        collection.update(obj);
    }

    delete(key: any, obj: Entity) {
        const collection = this.get(key);
        collection.delete(obj.__index);
    }
}
