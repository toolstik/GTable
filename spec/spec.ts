const _SPREADSHEET = SpreadsheetApp.getActive();
const _WORKSHEET_NAME = '__test';
let _WORKSHEET = _SPREADSHEET.getActiveSheet();

// @ts-ignore
const Runner: any = GSTestRunner;
// @ts-ignore
const Assert: any = GSUnit;

function test() {
    return new FeatureSuite().test_save_insert_without_read();
}

function runSuite(suite: any, test?: string) {
    const options = {
        notify: false
    };

    const result = test
        ? Runner.runTest(suite, suite.constructor.name)
        : Runner.runSuite(suite, suite.constructor.name, options);
    return result;
}

function runFeatureTests() {
    return runSuite(new FeatureSuite());
}

function runFeatureTest(testName: string) {
    return runSuite(new FeatureSuite(), testName);
}

class FeatureSuite {

    deleteSheet() {
        const sheet = _SPREADSHEET.getSheetByName(_WORKSHEET_NAME);
        if (sheet)
            _SPREADSHEET.deleteSheet(sheet);
    }

    createSheet() {
        _WORKSHEET = _SPREADSHEET.insertSheet(_WORKSHEET_NAME);
    }

    clearSheet() {
        _WORKSHEET = _SPREADSHEET.getSheetByName(_WORKSHEET_NAME);

        if (!_WORKSHEET)
            _WORKSHEET = _SPREADSHEET.insertSheet(_WORKSHEET_NAME);
        else
            _WORKSHEET.clear();
    }

    writeValues(values, start?) {
        if (!values || !values.length)
            return;

        const range = _WORKSHEET
            .getRange(start || "A1")
            .offset(0, 0, values.length, values[0].length);

        range.setValues(values);

        return range;
    }

    writeFormulasR1C1(values, start?) {
        if (!values || !values.length)
            return;

        const range = _WORKSHEET
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
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(_WORKSHEET_NAME, options);
        const items = table.findAll();
        Assert.assertObjectEquals([], items);
    }

    test_blank_sheet_no_header() {
        const options = {
            header: false,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(_WORKSHEET_NAME, options);
        const items = table.findAll();
        Assert.assertObjectEquals([], items);
    }

    test_mapping_auto_with_offset() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = Repository.create(_WORKSHEET_NAME, { offsetA1: "B4" });
        const items = table.findAll();
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 2, b: "word2" }], items);
    }

    test_mapping_auto_with_offset_no_header() {
        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = Repository.create(_WORKSHEET_NAME, {
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

        const table = Repository.create(_WORKSHEET_NAME);
        const items = table.findAll();
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 2, b: "word2" }], items);
    }

    test_mapping_auto_no_header() {
        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ]);

        const table = Repository.create(_WORKSHEET_NAME, {
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
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(_WORKSHEET_NAME, options);
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
            header: false,
            fields: [
                { name: "A" },
                { name: "B" }
            ]
        };
        const table = Repository.create(_WORKSHEET_NAME, options);
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
            fields: [
                { name: "B", columnName: "b" },
                { name: "A", columnName: "a" }
            ]
        };
        const table = Repository.create(_WORKSHEET_NAME, options);
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

        const table = Repository.create(_WORKSHEET_NAME);
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

        const table = Repository.create(_WORKSHEET_NAME);
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

        const table = Repository.create(_WORKSHEET_NAME);
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

    test_save_insert_without_read() {
        const values = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]
        const range = this.writeValues(values);

        const table = Repository.create(_WORKSHEET_NAME);
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

        const table = Repository.create(_WORKSHEET_NAME, {
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

}

Assert.assertObjectEquals = function () {
    Assert.GsUnit.validateArguments(2, arguments);
    var var1 = Assert.GsUnit.nonCommentArg(1, 2, arguments);
    var var2 = Assert.GsUnit.nonCommentArg(2, 2, arguments);
    var failureMessage = Assert.GsUnit.commentArg(2, arguments) ? Assert.GsUnit.commentArg(2, arguments) : '';

    if (var1 === var2)
        return;

    var isEqual = false;
    var typeOfVar1 = Assert.GsUnit.trueTypeOf(var1);
    var typeOfVar2 = Assert.GsUnit.trueTypeOf(var2);

    if (typeOfVar1 == typeOfVar2) {
        var primitiveEqualityPredicate = Assert.GsUnit.PRIMITIVE_EQUALITY_PREDICATES[typeOfVar1];

        if (primitiveEqualityPredicate) {
            isEqual = primitiveEqualityPredicate(var1, var2);
        }
        else {
            // var expectedKeys = Assert.GsUnit.Util.getKeys(var1).sort().join(", ");
            // var actualKeys = Assert.GsUnit.Util.getKeys(var2).sort().join(", ");
            // if (expectedKeys != actualKeys)
            // {
            // 	Assert.GsUnit.assert(failureMessage, false, 'Expected keys "' + expectedKeys + '" but found "' + actualKeys + '"');
            // }
            for (var i in var1) {
                Assert.assertObjectEquals(failureMessage + ' found nested ' + typeOfVar1 + '@' + i + '\n', var1[i], var2[i]);
            }
            isEqual = true;
        }
    }
    Assert.GsUnit.assert(failureMessage, isEqual, 'Expected ' + Assert.GsUnit.displayStringForValue(var1) + ' but was ' + Assert.GsUnit.displayStringForValue(var2));
}