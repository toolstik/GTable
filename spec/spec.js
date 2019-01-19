var spreasheet = SpreadsheetApp.getActive();
var worksheet = spreasheet.getActiveSheet();

function runSuite() {
    var options = {
        notify: false
    };

    var result = GSTestRunner.runSuite(this, "allTests", options);
    return result;
}

function deleteSheet() {
    var sheet = spreasheet.getSheetByName('__test');
    if (sheet)
        spreasheet.deleteSheet(sheet);
}

function createSheet() {
    worksheet = spreasheet.insertSheet('__test');
}

function beforeTest_(){
    deleteSheet();
    createSheet();
}

function afterTest_(){
    deleteSheet();
}

function testTry() {
    worksheet.getActiveCell().setValue(123);
}