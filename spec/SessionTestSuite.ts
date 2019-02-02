class SessionTestSuite extends TestSuite {

    beforeTest_() {
        for (let name in this.sheets)
            this.clear(name);
    }

    test_mapping_auto() {

        this.clear('test1');
        const values1 = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ];
        this.writeSheetValues('test1', values1);

        this.clear('test2');
        const values2 = [
            ["x", "y"],
            [true, 1.0],
            [false, 2.0]
        ];
        this.writeSheetValues('test2', values2);

        const session = new EntitySession();
        const test1 = session.getRepository('test1');
        const test2 = session.getRepository('test2');

        const items1 = test1.findAll();
        Assert.assertObjectEquals([{ a: 1, b: "word1" }, { a: 2, b: "word2" }], items1);

        const items2 = test2.findAll();
        Assert.assertObjectEquals([{ x: true, y: 1.0 }, { x: false, y: 2.0 }], items2);
    }

    test_mapping_manual() {

        this.clear('test1');
        const values1 = [
            ["a", "b"],
            [1, "word1"],
            [2, "word2"]
        ];
        this.writeSheetValues('test1', values1);

        this.clear('test2');
        const values2 = [
            ["x", "y"],
            [true, 1.0],
            [false, 2.0]
        ];
        this.writeSheetValues('test2', values2);

        const session = new EntitySession({
            entities: {
                test1: {
                    fields: [
                        { name: "A" },
                        { name: "B" }
                    ]
                },
                test2: {
                    fields: [
                        { name: "X" },
                        { name: "Y" }
                    ]
                }
            }
        });
        const test1 = session.getRepository('test1');
        const test2 = session.getRepository('test2');

        const items1 = test1.findAll();
        Assert.assertObjectEquals([{ A: 1, B: "word1" }, { A: 2, B: "word2" }], items1);

        const items2 = test2.findAll();
        Assert.assertObjectEquals([{ X: true, Y: 1.0 }, { X: false, Y: 2.0 }], items2);
    }

}