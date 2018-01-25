import * as assert from "assert";

/*
    This is a demo test suite using Mocha.
    Note that it is not required to import Mocha manually like the following:
        const Mocha = require('Mocha')
    Or
        import * as Mocha from 'Mocha'
    Mocha-specific functions will run as expected even without explicitly
     importing Mocha module.
 */

// 'describe' block contains a set of test.
// preferably the tests within a describe block should all aim to test related
// features.
describe("some demo test", () => {

    // 'it' block contains a single test case
    // it should be well-described for maintainability
    it('should add up to 5', function () {
        assert(2 + 3 === 5)
    });

});