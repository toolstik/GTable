class RepositoryTestSuite extends TestSuite {

    private WORKSHEET_NAME: string;

    constructor() {
        super();
        this.WORKSHEET_NAME = '__test';
    }

    writeValues(values: Object[][], start?: string) {
        return this.writeSheetValues(this.WORKSHEET_NAME, values, start);
    }

    writeFormulasR1C1(values: string[][], start?: string) {
        return this.writeSheetFormulasR1C1(this.WORKSHEET_NAME, values, start);
    }

    beforeTest_() {
        this.clear(this.WORKSHEET_NAME);
    }

    afterTest_() {

    }

    test_blank_sheet() {
        const options = {
            sheetName: this.WORKSHEET_NAME,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(options);
        const items = table.findAll();
        Assert.assertObjectEquals([], items);
    }

    test_blank_sheet_no_header() {
        const options = {
            sheetName: this.WORKSHEET_NAME,
            header: false,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(options);
        const items = table.findAll();
        Assert.assertObjectEquals([], items);
    }

    test_blank_sheet_no_header_lazy() {
        const options: Options = {
            sheetName: this.WORKSHEET_NAME,
            header: false,
            rangeScanLazy: true,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(options);
        const items = table.findAll();
        Assert.assertObjectEquals([], items);
    }

    test_mapping_auto_with_offset() {
        // some values in first column
        this.writeValues([[1], [2], [3], [4]]);

        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME, offsetA1: "B4" });
        const items = table.findAll();
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 2, b: "word2" }], items);
    }

    test_mapping_auto_with_offset_no_header() {
        // some values in first column
        this.writeValues([[1], [2], [3], [4]]);

        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = Repository.create({
            sheetName: this.WORKSHEET_NAME,
            offsetA1: "B4",
            header: false,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        });
        const items = table.findAll();
        Assert.assertObjectEquals([{ A: 1, B: "word1" }, { A: 2, B: "word2" }], items);
    }

    test_mapping_auto_with_offset_lazy() {
        // some values in first column
        this.writeValues([[1], [2], [3], [4]]);

        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = Repository.create({
            sheetName: this.WORKSHEET_NAME,
            offsetA1: "B4",
            rangeScanLazy: true
        });
        const items = table.findAll();
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 2, b: "word2" }], items);
    }

    test_mapping_auto_with_offset_no_header_lazy() {
        // some values in first column
        this.writeValues([[1], [2], [3], [4]]);

        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = Repository.create({
            sheetName: this.WORKSHEET_NAME,
            offsetA1: "B4",
            header: false,
            rangeScanLazy: true,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        });
        const items = table.findAll();
        Assert.assertObjectEquals([{ A: 1, B: "word1" }, { A: 2, B: "word2" }], items);
    }

    test_mapping_auto() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME });
        const items = table.findAll();
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 2, b: "word2" }], items);
    }

    test_mapping_auto_no_header() {
        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ]);

        const table = Repository.create({
            sheetName: this.WORKSHEET_NAME,
            header: false,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        });
        const items = table.findAll();
        Assert.assertObjectEquals([{ A: 1, B: "word1" }, { A: 2, B: "word2" }], items);
    }

    test_mapping_by_index() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]);

        const options = {
            sheetName: this.WORKSHEET_NAME,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(options);
        const items = table.findAll();
        Assert.assertObjectEquals([
            { A: 1, B: "word1" },
            { A: 2, B: "word2" }
        ], items);
    }

    test_mapping_by_index_no_header() {
        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ]);

        const options = {
            sheetName: this.WORKSHEET_NAME,
            header: false,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(options);
        const items = table.findAll();
        Assert.assertObjectEquals([
            { A: 1, B: "word1" },
            { A: 2, B: "word2" }
        ], items);
    }

    test_mapping_by_name() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]);

        const options = {
            sheetName: this.WORKSHEET_NAME,
            fields: [
                { name: "B", columnName: "b" },
                { name: "A", columnName: "a" }
            ]
        };
        const table = Repository.create(options);
        const items = table.findAll();
        Assert.assertObjectEquals([{ A: 1, B: "word1" }, { A: 2, B: "word2" }], items);
    }

    test_commit_no_changes() {
        const values = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]
        const range = this.writeValues(values);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME });
        const items = table.findAll();
        table.commit();
        Assert.assertObjectEquals(values, range.getValues());
    }

    test_save_no_commit_no_changes() {
        const values = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]
        const range = this.writeValues(values);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME });
        const items = table.findAll();
        const item1 = items[0];
        item1.a = 10;
        table.save(item1);
        Assert.assertObjectEquals(values, range.getValues());
    }

    test_save_update() {
        const values = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]
        const range = this.writeValues(values);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME });
        const items = table.findAll();
        const item2 = items[1];
        item2.a = 10;
        table.save(item2);
        table.commit();

        const expected = [
            ["a", "b"],
            [1, "word1"],
            [10, "word2"]
        ]
        Assert.assertObjectEquals(expected, range.getValues());
    }

    test_save_update_no_changes() {
        const values = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]
        const range = this.writeValues(values);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME });
        const items = table.findAll();
        const item2 = items[1];
        item2.a = 10;
        table.save(item2);
        item2.a = 2;
        table.save(item2);
        table.commit();

        const expected = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]
        Assert.assertObjectEquals(expected, range.getValues());
    }

    test_save_insert_without_read() {
        const values = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]
        const range = this.writeValues(values);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME });
        const item3 = {
            a: 3,
            b: "word3"
        };
        table.save(item3);
        table.commit();

        const expected = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"],
            [3, "word3"],
        ]
        Assert.assertObjectEquals(expected, range.offset(0, 0, 4).getValues());
    }

    test_mapping_formula_as_string() {
        const values = [
            ["a", "b", "c"],
            [1, "word1", 0],
            [2, "word2", 0]
        ];

        const formulas = [
            ["=R[0]C[-2]+1"],
            ["=R[0]C[-2]+1"],
        ];

        const range = this.writeValues(values);
        const formulasRange = this.writeFormulasR1C1(formulas, "C2")

        const table = Repository.create({
            sheetName: this.WORKSHEET_NAME,
            fields: [
                { name: "A" },
                { name: "B" },
                { name: "C", formula: "=RC[-2]+1" },
            ]
        });

        const items = table.findAll();
        Assert.assertObjectEquals([
            { A: 1, B: "word1", C: 2 },
            { A: 2, B: "word2", C: 3 }
        ], items);

        const item1 = items[0];
        item1.A = 2;
        item1.C = 15;
        table.save(item1);

        const item2 = items[1];
        item2.A = 3;
        table.save(item2);

        table.commit();

        const expected = [
            ["a", "b", "c"],
            [2, "word1", 3],
            [3, "word2", 4]
        ]
        Assert.assertObjectEquals(expected, range.getValues());
        Assert.assertObjectEquals(formulas, formulasRange.getFormulasR1C1());
    }

    test_save_update_readonly() {
        const values = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]
        const range = this.writeValues(values);

        const table = Repository.create({
            sheetName: this.WORKSHEET_NAME,
            fields: [
                { name: "a", readonly: true },
                { name: "b" }
            ]
        });
        const items = table.findAll();
        const item2 = items[1];
        item2.a = 10;
        item2.b = "new_word";
        table.save(item2);
        table.commit();

        const expected = [
            ["a", "b"],
            [1, "word1"],
            [2, "new_word"]
        ]
        Assert.assertObjectEquals(expected, range.getValues());
    }

    test_default_value() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, null],
            [3, ""]
        ]);

        const table = Repository.create({
            sheetName: this.WORKSHEET_NAME,
            fields: [
                {},
                { default: "defaultvalue" }
            ]
        });
        const items = table.findAll();
        Assert.assertObjectEquals([
            { a: 1, b: "word1" },
            { a: 2, b: "defaultvalue" },
            { a: 3, b: "defaultvalue" }
        ], items);
    }

    test_find() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"],
            [3, "word1"]
        ]);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME, index: false });
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 3, b: "word1" }], table.find({ b: "word1" }));
        Assert.assertObjectEquals([{ a: 1, b: "word1" }], table.find({ a: 1, b: "word1" }));
        Assert.assertObjectEquals([{ a: 2, b: "word2" }], table.find({ a: 2 }));
    }

    test_findOne() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"],
            [3, "word1"]
        ]);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME, index: false });
        Assert.failure(() => table.findOne({ b: "word1" }));
        Assert.assertObjectEquals({ a: 1, b: "word1" }, table.findOne({ a: 1, b: "word1" }));
        Assert.assertObjectEquals({ a: 2, b: "word2" }, table.findOne({ a: 2 }));
    }

    test_find_with_index() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"],
            [3, "word1"]
        ]);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME });
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 3, b: "word1" }], table.find({ b: "word1" }));
        Assert.assertObjectEquals([{ a: 1, b: "word1" }], table.find({ a: 1, b: "word1" }));
        Assert.assertObjectEquals([{ a: 2, b: "word2" }], table.find({ a: 2 }));
    }

    test_findOne_with_index() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"],
            [3, "word1"]
        ]);

        const table = Repository.create({ sheetName: this.WORKSHEET_NAME });
        Assert.failure(() => table.findOne({ b: "word1" }));
        Assert.assertObjectEquals({ a: 1, b: "word1" }, table.findOne({ a: 1, b: "word1" }));
        Assert.assertObjectEquals({ a: 2, b: "word2" }, table.findOne({ a: 2 }));
    }

}


