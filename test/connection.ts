import * as mongoose from "mongoose";
const debug = require('debug')('mongodb-node.js-express-crud-with-mocha:connection');

/**
* overriding the default mongoose Promises library
 * If using JS:
        mongoose.Promise = global.Promise;
 * If using TS:
   * (REF - section promise.js:
   * http://mongoosejs.com/docs/api.html#promise-js)
 *
 * To assign your own promise library in Typescript:
 *
 * 1. Typescript does not allow assigning properties of imported modules.
 *    To avoid compile errors use one of the options below in your code:
 *
 *    - (<any>mongoose).Promise = YOUR_PROMISE;
 *    - require('mongoose').Promise = YOUR_PROMISE;
 *    - import mongoose = require('mongoose');
 *      mongoose.Promise = YOUR_PROMISE;
 *
 * 2. To assign type definitions for your promise library, you will need
 *    to have a .d.ts file with the following code when you compile:
 *
 *    - import * as Q from 'q';
 *      declare module 'mongoose' {
   *        type Promise<T> = Q.promise<T>;
   *      }
 *
 *    - import * as Bluebird from 'bluebird';
 *      declare module 'mongoose' {
   *        type Promise<T> = Bluebird<T>;
   *      }
 *
 * Uses global.Promise by default. If you would like to use mongoose default
 *   mpromise implementation (which is deprecated), you can omit step 1 and
 *   run npm install @types/mongoose-promise
*
 *
* connectToDb :: (done? : (this: Mocha.IHookCallbackContext, done: MochaDone) => any) => void
 */
export let connectToDb = (done?) => {
    /*
    done - callback: (this: Mocha.IHookCallbackContext, done: MochaDone) => any
     */

    console.log('start connecting to mongodb');

    // connect to mongodb 'testaroo' at localhost, if it does not exist,
    // it will be created automatically.
    // connect() returns MongooseThenable which is not a true Promise<T>.
    // Note that the then() implementation of MongooseThenable is different:
    /**
     * then<TRes>(onFulfill?: () => void | TRes | PromiseLike<TRes>,
     * onRejected?: (err: mongodb.MongoError) => void | TRes | PromiseLike<TRes>): Promise<TRes>;
      */
    mongoose.connect("mongodb://localhost/testaroo");

    // The following can be rewritten into Promise chain using MongooseThenable:
    //      mongoose.connect(...).then(()=>done()).catch(err => throw err);
    // Alternatively we can use async event handlers like so:
    // once : listen to a event just for once
    // on : fire the callback whenever the event occurs
    mongoose.connection.once("open", () => {
        debug("connected to mongodb: testaroo at localhost");
        done() // used by Mocha if hooked
    }).on("error", (err) => {
        debug(`Connection failed with error ${err}`)
    });

};

/**
 * Preferably this should be called inside a Promise chain.
 * Only invoke this function directly if you know what you are doing.
 * disconnectFromDB :: (err? : Error | T extends MongoError) => Promise<void> | Promise<Error> | Promise<T extends MongoError>
 * @param err
 */
export let disconnectFromDB = (err?) => {
    return new Promise((resolve, reject) => {
        if (err === undefined){
            console.log("start disconnecting");
            mongoose.disconnect()
                .then(() => debug('Disconnected from MongoDB'))
                .then(() => resolve())
                .catch(err => {debug(err); return reject(err)});
        }
        else reject(err)
    });
};

/**
 * dropCollectionMariochars :: () => Promise<void> | Promise<Error> | Promise<T extends MongoError>
 *
 * all the native mongo driver api methods are callable via properties like:
            mongoose.connection.db
            mongoose.model(...).db
            mongoose.model(...).collection
            ... etc.
    Assuming a required, connected, mongoose variable,
    the native Db object is accessible via mongoose.connection.db
    example usage:
            mongoose.connection.db.dropDatabase()
            mongoose.connection.db.collection(...).insertMany(...)
            mongoose.connection.db.collection(...).insertOne(...)
            mongoose.connection.db.collection(...).deleteOne(...)
            mongoose.connection.db.collection(...).bulkWrite(<native mongo operations>)
    For more information on bulkWrite() see http://mongoosejs.com/docs/api.html#bulkwrite_bulkWrite
*/
export let dropCollectionMariochars = () => {
    return new Promise((resolve, reject) => {
        mongoose.connection.db.dropCollection("mariochars")
            .then(isDeleted => {
                if (!isDeleted)
                    reject( new Error('failed to deleted collection:'
                    + 'mariochars'));
                debug('deleted collection: mariochars');
                resolve();
            })
            .catch(err => {debug(err); return reject(err)});
    });
};

// demonstrate defining a hook in a different module
// this hook remain accessible via Mocha's hook lookup
beforeEach('drop mariochars collection before each test', done => {

    console.log("dropping mariochars before each test");
    // an alternative way to drop a collection
    mongoose.connection.collections.mariochars.drop()
        .then(() => done())
        .catch(err => {
            // if the error is 'ns not found', meaning that the collection
            // 'mariochars' does not exist in the database 'testaroo',
            // we can safely ignore the error as presumably the collection
            // has been removed by previous hooks.
            if (String(err).trim() === 'MongoError: ns not found') done();
            else throw err
        })

});
