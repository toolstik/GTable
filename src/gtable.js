function GTable(sheetName, options) {
    options = options || {};
    options.offsetA1 = options.offsetA1 || "A1";
    options.spreadSheet = options.spreadSheet || SpreadsheetApp.getActive();
    this.options = options;

    this.sheet = this.options.spreadSheet.getSheetByName(sheetName);
}

GTable.prototype.dataRange = function () {
    if (this._dataRange !== undefined) return this._dataRange;

    var dataRange = this.sheet.getRange(this.options.offsetA1);
    var firstRow = dataRange.getRow();
    var firstColumn = dataRange.getColumn();
    var lastRow = this.sheet.getLastRow();
    var lastColumn = this.sheet.getLastColumn();

    var numRows = lastRow - firstRow + 1;
    var numColumns = lastColumn - firstColumn + 1;

    if (numRows < 2 || numColumns < 1)
        return (this._dataRange = null);

    this._dataRange = dataRange.offset(1, 0, numRows - 1, numColumns);

    return this._dataRange;
}

GTable.prototype.values = function () {
    if (this._values !== undefined) return this._values;

    var range = this.dataRange();
    this._values = !range ? [] : range.getValues();

    return this._values;
}

GTable.create = function (sheetName, options) {
    return new GTable(sheetName, options);
}