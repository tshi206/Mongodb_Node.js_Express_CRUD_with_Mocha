import * as mongoose from "mongoose";
const debug = require('debug')('mongodb-node.js-express-crud-with-mocha:connection');

export let connectToDb = () => {
    console.log('start connecting to mongodb');

    // connect to mongodb 'testaroo' at localhost, if it does not exist,
    // it will be created automatically
    mongoose.connect("mongodb://localhost/testaroo");

    // once : listen to a event just for once
    // on : fire the callback whenever the event occurs
    mongoose.connection.once("open", () => {
        debug("connected to mongodb: testaroo at localhost")
    }).on("error", (err) => {
        debug(`Connection failed with error ${err}`)
    });

};

// Preferably this should be called inside a Promise chain.
// Only invoke this function directly if you know what you are doing.
export let disconnectFromDB = (err?) => {
    if (err === undefined){
        console.log("start disconnecting");
        mongoose.disconnect().then(() => debug('Disconnected from MongoDB'))
        .catch(err => debug(err));}
    else throw err
};

/*  all the native mongo driver api methods are callable via:
            mongoose.connection.db
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
    return new Promise(((resolve, reject) => {
        mongoose.connection.db.dropCollection("mariochars")
            .then(isDeleted => {
                if (!isDeleted)
                    throw new Error('failed to deleted collection:'
                    + 'mariochars');
                debug('deleted collection: mariochars');
                resolve();
            })
            .catch(err => {debug(err); reject(err)});
    }));
};
