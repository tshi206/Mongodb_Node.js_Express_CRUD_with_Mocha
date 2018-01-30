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

describe('Updating records', function () {

    let char;

    // this hook below is scoped by its outer describe() block
    // therefore it is NOT accessible to the other describe() blocks
    beforeEach("populating DB with a single record before test:" +
        " updating_test", done => {

        console.log("persisting {name : 'Mario'} to the DB");
        char = new MarioChar({
            name: 'Mario',
            weight: 50
        });

        char.save().then(result => {
            console.log(`saving ${result}`);
            assert(result !== undefined);
            assert(result !== null);
            // isNew() is a method used to determined whether or not an instance
            // of a model has been persisted.
            // It returns true if the model instance HAS NOT been persisted,
            // otherwise returns false meaning the instance HAS been persisted.
            assert(char.isNew === false);
            assert(result.isNew === false);
            // check if both reference the same object
            assert(result === char);
            equal(result, char);
            // Explicitly calling done() to end this test case.
            // We can hence include multiple assertions in a single test case.
            // In this example, because the assertion is wrapped in a callback,
            // Mocha cannot automatically detect the termination for this test
            // case.
            done()
        }).catch(err => {throw err});
    });

    /**
     * Note:
     All top level update keys which are not atomic operation names are treated
     as set operations:

     Example:
        var query = { name: 'borne' };
        Model.findOneAndUpdate(query, { name: 'jason bourne' }, options, callback)

        // is sent as
        Model.findOneAndUpdate(query, { $set: { name: 'jason bourne' }}, options, callback)

     This helps prevent accidentally overwriting your document with
     { name: 'jason bourne' }.
    */
    it('Updates a record using findOneAndUpdate', function (done) {
        // used options
        // strict: overwrites the schema's strict mode option for this update
        //         more info see: mariochar.ts, on MarioCharSchema
        //         ref: http://mongoosejs.com/docs/guide.html#strict
        // new:    bool - if true, return the modified document rather than the
        //         original. defaults to false (changed in 4.0)
        MarioChar.findOneAndUpdate({name: 'Mario'}, {name: 'Luigi', age: 20}
        , {strict: false, new: true})
            .then(result => {
                console.log(`findOneAndUpdate retrieved: ${result}`);
                assert(result._id.toString() === char._id.toString());
                // attempt to retrieve the same document again
                // using findById(), this time the updated document should be
                // retrieved
                return MarioChar.findById(result._id)
            })
            .then(result => {
                assert(result.name === 'Luigi');
                // because 'age' property is not defined in the Schema
                // to access such property we must either:
                //      - convert the mongoose obj into regular Object via
                //              result = result.toObject();
                // or
                //      - use the get method:
                //              result.get('<property_name>')
                assert(result.get('age') === 20);
                assert(result.toObject().age === 20)
            })
            .then(done)
            .catch(err => {throw err})
    });

    it('Updates corresponding record using the persisted instance', function (done) {
        // valid options: same as Model.update(...)
        char.update({name : 'Luigi', gender: 'male'}, {strict: false})
            .then(result =>
                console.log('Response from char.update({name : \'Luigi\',' +
                    ' gender: \'male\'}): ' + JSON.stringify(result)))
            .then(() => {return MarioChar.findById(char._id)})
            .then(result => {
                equal(result.name, 'Luigi');
                assert(result.get('gender') === 'male');
                equal(result.toObject().gender, 'male')
            })
            .then(done).catch(err => {throw err})
    });

    it('Updates a record using Model.update() ', function (done) {
        // Model.update(<criteria obj>) --- updates all the documents satisfying the
        // criteria in the collection corresponding to the given Model
        /**
         * Valid options:
         *      safe (boolean) safe mode (defaults to value set in schema (true))
         *      upsert (boolean) whether to create the doc if it doesn't match (false)
         *      multi (boolean) whether multiple documents should be updated (false)
         *      runValidators: if true, runs update validators on this command.
         *                     Update validators validate the update operation against
         *                     the model's schema.
         *      setDefaultsOnInsert: if this and upsert are true, mongoose will
         *                     apply the defaults specified in the model's schema
         *                     if a new document is created. This option only works
         *                     on MongoDB >= 2.4 because it relies on MongoDB's
         *                     $setOnInsert operator.
         *      strict (boolean) overrides the strict option for this update
         *      overwrite (boolean) disables update-only mode, allowing you to
         *                     overwrite the doc (false)
         * All update values are cast to their appropriate SchemaTypes before being sent.
         */
        MarioChar.update(char, {name: 'Luigi'})
            .then(result =>
                console.log(
                    `Response from MarioChar.update(char, {name: 'Luigi'}): ${JSON.stringify(result)}`
                ))
            .then(() => {return MarioChar.findById(char._id)})
            .then(result => assert(result.name === 'Luigi'))
            .then(done).catch(err => {throw err})
    });

    it('Adds a new field and then renames it', function (done) {
        char.update({hobbies : 'soccer'}, {strict: false})
            .then(() => {
                return MarioChar.findOne(char)
            })
            .then(result => {
                console.log(result);
                equal(result.toObject().hobbies, 'soccer')
            })
            .then(() => {
                return char.update({$rename : {"hobbies" : "hobby"}}, {strict: false})
            })
            .then(() => {
                return MarioChar.findOne(char).then(result => {
                    console.log(result);
                    equal(result.get('hobby'), 'soccer')
                })
            }).then(done).catch(err => {throw err})
    });

    it('Adds a numeric field and then increments it', function (done) {
        char.update({balance : 200}, {strict: false})
            .then(() => {
                return MarioChar.findOne(char)
            })
            .then(result => {
                console.log(result);
                equal(result.toObject().balance, 200)
            })
            .then(() => {
                return char.update({$inc : {"balance" : 50}}, {strict: false})
            })
            .then(() => {
                return MarioChar.findOne(char).then(result => {
                    console.log(result);
                    equal(result.get('balance'), 250)
                })
            }).then(done).catch(err => {throw err})
    });

    it('Reduces the value of weight property for all records by 5', function (done) {

        MarioChar.find().then(results => {
            console.log(results);
            results = results.map(result => result.weight);
            return MarioChar.update({}, {$inc: {'weight' : -5}})
                .then(response => {
                    console.log(response);
                    return MarioChar.find();
                })
                .then(updatedResults => {
                    console.log(updatedResults);
                    return updatedResults.map(updatedResult => updatedResult.weight)
                })
                .then(transformedResults => {
                    equal(transformedResults.length, results.length);
                    for (let i = 0; i < results.length; i++){
                        equal(results[i] - transformedResults[i], 5)
                    }
                })
        }).then(done).catch(err => {throw err})
    });

});