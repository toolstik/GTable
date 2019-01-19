var _SPREADSHEET = SpreadsheetApp.getActive();
var _WORKSHEET_NAME = '__test';
var _WORKSHEET = _SPREADSHEET.getActiveSheet();
var _WORKRANGE = _WORKSHEET.getActiveRange();

function runSuite() {
    var options = {
        notify: false
    };

    var result = GSTestRunner.runSuite(this, "allTests", options);
    return result.testsResults;
}

function deleteSheet() {
    var sheet = _SPREADSHEET.getSheetByName(_WORKSHEET_NAME);
    if (sheet)
        _SPREADSHEET.deleteSheet(sheet);
}

function createSheet() {
    _WORKSHEET = _SPREADSHEET.insertSheet(_WORKSHEET_NAME);
}

function writeValues(values, start) {
    if (!values || !values.length)
        return;

    _WORKRANGE = _WORKSHEET
        .getRange(start || "A1")
        .offset(0, 0, values.length, values[0].length);

    _WORKRANGE.setValues(values);
}

function beforeTest_() {
    deleteSheet();
    createSheet();
}

function afterTest_() {
    // deleteSheet();
}

function test_empty_values_on_empty_sheet() {
    var table = GTable.create(_WORKSHEET_NAME);
    GSUnit.assertEquals(0, table.values().length);
}

function test_items_and_rows_count_equals() {
    writeValues([
        ["a", "b"],
        [1, "word1"],
        [2, "word2"]
    ]);

    var table = GTable.create(_WORKSHEET_NAME);
    GSUnit.assertEquals(2, table.values().length);
}

function test_items_and_rows_count_equals_with_offset_A1() {
    writeValues([
        ["a", "b"],
        [1, "word1"],
        [2, "word2"]
    ], "B4");

    var table = GTable.create(_WORKSHEET_NAME, { offsetA1: "B4" });
    GSUnit.assertEquals(2, table.values().length);
}