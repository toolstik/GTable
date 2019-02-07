class GoodelBenchmark extends BenchmarkTestSuite {
    // @ts-ignore
    private goodel: any = Goodel;
    
    test_one_sheet_find(): void {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"],
            [3, "word1"]
        ]);

        this.measure(() => {
            const table = this.goodel(this.WORKSHEET_NAME);
            Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 3, b: "word1" }], table.findWhere({ b: "word1" }));
            Assert.assertObjectEquals([{ a: 1, b: "word1" }], table.findWhere({ a: 1, b: "word1" }));
            Assert.assertObjectEquals([{ a: 2, b: "word2" }], table.findWhere({ a: 2 }));
        });
    }
}
