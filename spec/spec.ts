// @ts-ignore
const Runner: any = GSTestRunner;
// @ts-ignore
const Assert: any = GSUnit;

function test() {
    return new RepositoryTestSuite().test_save_update_readonly();
}

function runSuite(suite: TestSuite, test?: string) {
    const options = {
        notify: false
    };

    const result = test
        ? Runner.runTest(suite, suite.constructor.name)
        : Runner.runSuite(suite, suite.constructor.name, options);
    return result;
}

function runFeatureTests() {
    return runSuite(new RepositoryTestSuite());
}

function runFeatureTest(testName: string) {
    return runSuite(new RepositoryTestSuite(), testName);
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