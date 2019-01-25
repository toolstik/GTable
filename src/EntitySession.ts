class EntitySession {

    private _types: { [type: string]: Repository };
    private _options: SessionOptions;

    constructor(options?: SessionOptions) {
        this._options = options || new SessionOptions();
        this._types = {};

        // for (let type in options.entities) {
        //     this._types[type] = new Repository(this._options.entities[type]);
        // }
    }

    getRepository(name: string) {
        if (this._types[name])
            return this._types[name];

        const repoOptions = this._options.entities[name] || { sheetName: name };
        this._types[name] = new Repository(repoOptions);
        return this._types[name];
    }
}
