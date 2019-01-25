abstract class TestSuite {
    beforeTest_?(): void;
    afterTest_?(): void;
    beforeSuite_?(): void;
    afterSuite_?(): void;

    sheets: { [name: string]: GoogleAppsScript.Spreadsheet.Sheet };

    constructor() {
        this.sheets = {};
    }

    getSheet(name: string) {
        return this.sheets[name] || (this.sheets[name] = getSheet(name));
    }

    clear(name: string) {
        const sheet = this.getSheet(name);
        sheet.clear();
        return sheet;
    }

    writeSheetValues( sheetName: string, values: Object[][], start?: string) {
        if (!values || !values.length)
            return;

        const range = this.getSheet(sheetName)
            .getRange(start || "A1")
            .offset(0, 0, values.length, values[0].length);

        range.setValues(values);

        return range;
    }

    writeSheetFormulasR1C1(sheetName: string, values: string[][], start?: string) {
        if (!values || !values.length)
            return;

        const range = this.getSheet(sheetName)
            .getRange(start || "A1")
            .offset(0, 0, values.length, values[0].length);

        range.setFormulasR1C1(values);

        return range;
    }
}


