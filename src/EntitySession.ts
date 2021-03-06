class EntitySession {

    private _types: { [type: string]: Repository };

    constructor(private options?: SessionOptions) {
        this.options = new SessionOptions(options);
        this._types = {};
    }

    getRepository(name: string) {
        if (this._types[name])
            return this._types[name];

        const repoOptions = SessionOptions.getEntityOptions(this.options, name);
        this._types[name] = new Repository(repoOptions);
        return this._types[name];
    }
}
