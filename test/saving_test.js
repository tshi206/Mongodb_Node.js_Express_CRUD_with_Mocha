"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const connection_1 = require("./connection");
const assert_1 = require("assert");
const MarioChar = require('../models/mariochar');
/*
    This is a demo test suite using Mocha.
    Note that it is not required to import Mocha manually like the following:
        const Mocha = require('Mocha')
    Or
        import * as Mocha from 'Mocha'
    Mocha-specific functions will run as expected even without explicitly
     importing Mocha module.
     Hence, Mocha can look up all the hooks we defined even they are scattered
     across our project. In conclusion, hooks can be defined across different
     modules over the entire project directories.
 */
// this is just to demonstrate that hooks can be defined outside the describe() block
before("connecting to DB", done => {
    // connect to db
    connection_1.connectToDb(done);
});
after("disconnecting from DB", done => {
    connection_1.dropCollectionMariochars().then(connection_1.disconnectFromDB)
        .then(() => done()).catch(err => { throw err; });
});
// 'describe' block contains a set of test.
// preferably the tests within a describe block should all aim to test related
// features.
describe("Saving records", () => {
    /*
        The following two hooks are used to demonstrate that hooks can be
        defined in different code blocks and still accessible to Mocha.
        Defining hooks in a separate module also works without explicitly
        importing neither Mocha nor the defining module itself.
     */
    // before("connecting to DB", done => {
    //     // connect to db
    //     connectToDb(done);
    // });
    //
    // after("disconnecting from DB", done => {
    //     dropCollectionMariochars().then(disconnectFromDB)
    //         .then(() => done()).catch(err => {throw err});
    // });
    // 'it' block contains a single test case
    // it should be well-described for maintainability
    it('Saves a record to the database', function (done) {
        let mario = new MarioChar({
            name: 'Mario'
        });
        mario.save().then(result => {
            console.log(`saving ${result}`);
            assert(result !== undefined);
            assert(result !== null);
            // isNew() is a method used to determined whether or not an instance
            // of a model has been persisted.
            // It returns true if the model instance HAS NOT been persisted,
            // otherwise returns false meaning the instance HAS been persisted.
            assert(mario.isNew === false);
            assert(result.isNew === false);
            // check if both reference the same object
            assert(result === mario);
            assert_1.equal(result, mario);
            // Explicitly calling done() to end this test case.
            // We can hence include multiple assertions in a single test case.
            // In this example, because the assertion is wrapped in a callback,
            // Mocha cannot automatically detect the termination for this test
            // case.
            done();
        }).catch(err => { throw err; });
    });
});
//# sourceMappingURL=saving_test.js.map