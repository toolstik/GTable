class GibernateBenchmark extends BenchmarkTestSuite {

    test_one_sheet_find() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"],
            [3, "word1"]
        ]);

        this.measure(() => {
            const table = Repository.create({ sheetName: this.WORKSHEET_NAME, index: false });
            Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 3, b: "word1" }], table.find({ b: "word1" }));
            Assert.assertObjectEquals([{ a: 1, b: "word1" }], table.find({ a: 1, b: "word1" }));
            Assert.assertObjectEquals([{ a: 2, b: "word2" }], table.find({ a: 2 }));
        });

    }

}


