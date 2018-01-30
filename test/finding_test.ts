import * as assert from "assert";
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
     Hence, Mocha can look up all the hooks we defined even they are scattered
     across our project. In conclusion, hooks can be defined across different
     modules over the entire project directories.
 */

describe("Finding records", () => {

    let mario;

    // this hook below is scoped by its outer describe() block
    // therefore it is NOT accessible to the other describe() blocks
    beforeEach("populating DB with a single record before test:" +
        " finding_test", done => {

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
            equal(result, mario);
            // Explicitly calling done() to end this test case.
            // We can hence include multiple assertions in a single test case.
            // In this example, because the assertion is wrapped in a callback,
            // Mocha cannot automatically detect the termination for this test
            // case.
            done()
        }).catch(err => {throw err});
    });

    // 'it' block contains a single test case
    // it should be well-described for maintainability
    it('Finds one record from the database', function (done) {

        // find: will find as many records as possible if multiple documents appear
        //      to satisfy the criteria
        // findOne: only retrieve one record from the database if any, only the
        //      first encountered document will be retrieved

        // DB should only contain one record at the moment
        // using the promise returned from executing a query
        let query = MarioChar.find({});
        let promise = query.exec();
        promise.then(results => assert(results.length === 1))
            .then(() => {
                // Another way to count the whole results
                // Note that exec() is used to force the query to be executed
                // immediately and more importantly exec() returns a Promise<T>
                // that we can call then() on.
                // Without calling exec(), there is no guarantee that the async
                // will be executed immediately, though, async functions like
                // find(), findOne(), count(), etc. will still return either a
                // PromiseLike or a Thenable.
                return MarioChar.find().count().exec()
                    .then(count => equal(count, 1))
                // Also, JS is not a pure functional language hence the interpreter
                // DOES NOT assume any statement to be an expression unlike Scala.
                // Thus, it is essential to use explicit 'return' to "force" any
                // function to wait for its async codes to resolve into a Promise
                // before returning it.
                // The above return keyword is used to force the lambda to wait for
                // those async calls around count() to resolve into a Promise or
                // PromiseLike and then return it. Without this return, it simply
                // does not wait for the async codes to be resolved and returns a
                // Promise of "nothing", leaving some process running by itself
                // in the background.
            })
            .then(() => {
                // Count specified records with given criteria
                // The implementation below is just to show that using default
                // callbacks specified by the library is always viable.
                // In order to restore composition I need to switch to promise
                // to serialize async executions.
                /*
                    MarioChar.count({name: 'Mario'}, (err, count) => {
                        if (!err) assert(count === 1);
                        else throw err;
                    });
                 */
                return MarioChar.count({name: 'Mario'}).exec()
                    .then(count => equal(count, 1))
            })
            .then(() => {
                // Find the 'Mario' record using findOne()
                return MarioChar.findOne({name : 'Mario'}).then(result =>
                    assert(result.name === 'Mario')
                )
            })
            .then(() => done())
            .catch(err => {throw err});
    });

    it('Finds one record by ID from the database', function (done) {

        // When instantiate a document via mongoose.Model's constructor
        // a unique ObjectId({<Int32>}) is initialized automatically by mongoose.
        // It will then be referenced by the '_id' property in the document
        // created and we don't need to explicitly initialize this property
        // by ourselves.
        // Note that when querying the mongo DB we don't need to perform any
        // casting on the '_id' field to make it an ObjectID. Mongoose will do
        // the casting if needed, automatically when invoking methods like find(),
        // findOne(), findById().
        MarioChar.findOne({_id : mario._id}).exec().then(result => {
            assert(result._id.toString() === mario._id.toString())
        })
            // An alternative way of finding documents by _ids is to use findById()
            .then(() => {return MarioChar.findById(mario._id)})
            .then(result => equal(String(result._id), String(mario._id)))
            .then(done)
            .catch(err => {throw err})

    });

});