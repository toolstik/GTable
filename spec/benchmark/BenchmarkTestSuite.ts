abstract class BenchmarkTestSuite extends TestSuite {
    abstract test_one_sheet_find(): void;

    private iterations = 10;

    WORKSHEET_NAME: string;
    
    constructor() {
        super();
        this.WORKSHEET_NAME = '__benchmark';
    }

    beforeTest_() {
        this.clear(this.WORKSHEET_NAME);
    }

    writeValues(values: Object[][], start?: string) {
        return this.writeSheetValues(this.WORKSHEET_NAME, values, start);
    }

    private percentile(array: number[], percent: number) {
        const position = Math.round((array.length - 1) * percent);
        const sorted = array.sort((x, y) => x - y);
        return sorted[position];
    }

    measure(test: () => void) {
        const results = []
        for (let i = 0; i < this.iterations; i++) {
            const start = Date.now();
            test();
            const elapsed: number = Date.now() - start;
            results.push(elapsed);
        }

        const metrics = {
            first: results[0],
            fastest: Math.min.apply(null, results),
            slowest: Math.max.apply(null, results),
            sum: results.reduce((x, y) => x + y)
        }
        metrics['avg'] = metrics.sum / results.length;
        metrics['avgTrim'] =
            results.length < 3 ? null : (metrics.sum - metrics.fastest - metrics.slowest) / (results.length - 2);
        metrics['perc50'] = this.percentile(results, 50);
        metrics['perc80'] = this.percentile(results, 80);

        Logger.log(metrics);
    }
}


