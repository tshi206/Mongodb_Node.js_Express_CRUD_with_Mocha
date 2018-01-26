import * as assert from "assert";
import {connectToDb, disconnectFromDB, dropCollectionMariochars} from "./connection";
import {equal} from "assert";

const MarioChar = require('../models/mariochar');

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
describe("Saving records", () => {

    before("connect to DB", done => {
        // connect to db
        connectToDb();
        done()
    });

    after("disconnect from DB", done => {
        dropCollectionMariochars().then(disconnectFromDB);
        done()
    });

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
            equal(result, mario);
            // Explicitly calling done() to end this test case.
            // We can hence include multiple assertions in a single test case.
            // In this example, because the assertion is wrapped in a callback,
            // Mocha cannot automatically detect the termination for this test
            // case.
            done()
        });
    });

});