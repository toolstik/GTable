class Mapper {
    options: Options;

    constructor(options: Options) {
        this.options = options;
    }
    
    toObject(row: Object[]): any {
        return this.options.headers.reduce((prev, cur, i) => {
            prev[cur] = row[i];
            return prev;
        }, {});
    }
}
