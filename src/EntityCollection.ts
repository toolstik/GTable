class EntityCollection {
    private _items: { [index: number]: Entity };

    constructor() {
        this._items = {};
    }

    values() {
        return Object.values(this._items);
    }

    indexes() {
        return Object.keys(this._items);
    }

    get(index: number) {
        return this._items[index];
    }

    update(obj: Entity) {
        this._items[obj.__index] = obj;
    }

    delete(index: number) {
        delete this._items[index];
    }
}
