class RepositoryTestSuite implements TestSuite {

    private _SPREADSHEET: GoogleAppsScript.Spreadsheet.Spreadsheet;
    private _WORKSHEET_NAME: string;
    private _WORKSHEET: GoogleAppsScript.Spreadsheet.Sheet;

    constructor() {
        this._SPREADSHEET = SpreadsheetApp.getActive();
        this._WORKSHEET_NAME = '__test';
    }

    deleteSheet() {
        const sheet = this._SPREADSHEET.getSheetByName(this._WORKSHEET_NAME);
        if (sheet)
            this._SPREADSHEET.deleteSheet(sheet);
    }

    createSheet() {
        this._WORKSHEET = this._SPREADSHEET.insertSheet(this._WORKSHEET_NAME);
    }

    clearSheet() {
        this._WORKSHEET = this._SPREADSHEET.getSheetByName(this._WORKSHEET_NAME);

        if (!this._WORKSHEET)
            this._WORKSHEET = this._SPREADSHEET.insertSheet(this._WORKSHEET_NAME);
        else
            this._WORKSHEET.clear();
    }

    writeValues(values, start?) {
        if (!values || !values.length)
            return;

        const range = this._WORKSHEET
            .getRange(start || "A1")
            .offset(0, 0, values.length, values[0].length);

        range.setValues(values);

        return range;
    }

    writeFormulasR1C1(values, start?) {
        if (!values || !values.length)
            return;

        const range = this._WORKSHEET
            .getRange(start || "A1")
            .offset(0, 0, values.length, values[0].length);

        range.setFormulasR1C1(values);

        return range;
    }

    beforeTest_() {
        this.clearSheet();
    }

    afterTest_() {
        // this.deleteSheet();
    }

    test_blank_sheet() {
        const options = {
            sheetName: this._WORKSHEET_NAME,
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
            sheetName: this._WORKSHEET_NAME,
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

    test_mapping_auto_with_offset() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = Repository.create({ sheetName: this._WORKSHEET_NAME, offsetA1: "B4" });
        const items = table.findAll();
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 2, b: "word2" }], items);
    }

    test_mapping_auto_with_offset_no_header() {
        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = Repository.create({
            sheetName: this._WORKSHEET_NAME,
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

    test_mapping_auto() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]);

        const table = Repository.create({ sheetName: this._WORKSHEET_NAME });
        const items = table.findAll();
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 2, b: "word2" }], items);
    }

    test_mapping_auto_no_header() {
        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ]);

        const table = Repository.create({
            sheetName: this._WORKSHEET_NAME,
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
            sheetName: this._WORKSHEET_NAME,
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
            sheetName: this._WORKSHEET_NAME,
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
            sheetName: this._WORKSHEET_NAME,
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

        const table = Repository.create({ sheetName: this._WORKSHEET_NAME });
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

        const table = Repository.create({ sheetName: this._WORKSHEET_NAME });
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

        const table = Repository.create({ sheetName: this._WORKSHEET_NAME });
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

        const table = Repository.create({ sheetName: this._WORKSHEET_NAME });
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

        const table = Repository.create({ sheetName: this._WORKSHEET_NAME });
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
            sheetName: this._WORKSHEET_NAME,
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
            sheetName: this._WORKSHEET_NAME,
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

}


