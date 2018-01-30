"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
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
describe('Deleting records', function () {
    let mario;
    // this hook below is scoped by its outer describe() block
    // therefore it is NOT accessible to the other describe() blocks
    beforeEach("populating DB with a single record before test:" +
        " deleting_test", done => {
        console.log("persisting {name : 'Mario'} to the DB");
        mario = new MarioChar({
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
    it('Deletes a record using findOneAndRemove', function (done) {
        MarioChar.findOneAndRemove({ name: 'Mario' })
            .then(result => {
            console.log(`findOneAndRemove retrieved: ${result}`);
            // attempt to retrieve the same document again
            // it should return Promise<null> this time upon successful
            // deletion made by the previous findOneAndRemove()
            return MarioChar.findOne(result);
        })
            .then(result => assert(result === null))
            .then(done)
            .catch(err => { throw err; });
    });
    it('Deletes corresponding record using the persisted instance', function (done) {
        mario.remove()
            .then(result => console.log('Response from mario.remove(): ' + result))
            .then(() => { return MarioChar.findOne(mario); })
            .then(result => assert_1.equal(result, null))
            .then(done).catch(err => { throw err; });
    });
    it('Deletes a record using Model.remove() ', function (done) {
        // Model.remove(<criteria obj>) --- removes all the documents satisfying the
        // criteria from the collection corresponding to the given Model
        MarioChar.remove(mario)
            .then(result => console.log(`Response from MarioChar.remove(mario): ${JSON.stringify(result)}`))
            .then(() => { return MarioChar.findOne(mario); })
            .then(result => assert(result === null))
            .then(done).catch(err => { throw err; });
    });
});
//# sourceMappingURL=deleting_test.js.map