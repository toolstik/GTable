const _SPREADSHEET = SpreadsheetApp.getActive();
const _WORKSHEET_NAME = '__test';
let _WORKSHEET = _SPREADSHEET.getActiveSheet();
let _WORKRANGE = _WORKSHEET.getActiveRange();

// @ts-ignore
const Runner: any = GSTestRunner;
// @ts-ignore
const Assert: any = GSUnit;

function runSuite(suite: any) {
    const options = {
        notify: false
    };

    const result = Runner.runSuite(suite, (typeof suite).toString(), options);
    return result.testsResults;
}

function runFeatureTests() {
    return runSuite(new FeatureSuite());
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

    writeValues(values, start?) {
        if (!values || !values.length)
            return;

        _WORKRANGE = _WORKSHEET
            .getRange(start || "A1")
            .offset(0, 0, values.length, values[0].length);

        _WORKRANGE.setValues(values);
    }

    beforeTest_() {
        this.deleteSheet();
        this.createSheet();
    }

    afterTest_() {
        // this.deleteSheet();
    }

    test_empty_values_on_empty_sheet() {
        const table = GTable.create(_WORKSHEET_NAME);
        Assert.assertEquals(0, table.findAll().length);
    }

    test_items_and_rows_count_equals() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]);

        const table = GTable.create(_WORKSHEET_NAME);
        Assert.assertEquals(2, table.findAll().length);
    }

    test_items_and_rows_count_equals_with_offset_A1() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = GTable.create(_WORKSHEET_NAME, { offsetA1: "B4" });
        Assert.assertEquals(2, table.findAll().length);
    }

    test_items_and_rows_count_equals_with_offset_A1_no_header() {
        this.writeValues([
            [1, "word1"],
            [2, "word2"]
        ], "B4");

        const table = GTable.create(_WORKSHEET_NAME, { offsetA1: "B4", header: false });
        Assert.assertEquals(2, table.findAll().length);
    }

    test_auto_mapping() {
        this.writeValues([
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ]);

        const table = GTable.create(_WORKSHEET_NAME);
        const items = table.findAll();
        Assert.assertEquals(2, items.length);
        Assert.assertObjectEquals({ a: 1, b: "word1" }, items[0]);
        Assert.assertObjectEquals({ a: 2, b: "word2" }, items[1]);
    }

}