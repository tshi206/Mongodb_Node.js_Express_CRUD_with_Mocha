"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const debug = require('debug')('mongodb-node.js-express-crud-with-mocha:connection');
exports.connectToDb = () => {
    // connect to mongodb 'testaroo' at localhost, if it does not exist,
    // it will be created automatically
    mongoose.connect("mongodb://localhost/testaroo");
    // once : listen to a event just for once
    // on : fire the callback whenever the event occurs
    mongoose.connection.once("open", () => {
        debug("connected to mongodb: testaroo at localhost");
    }).on("error", (err) => {
        debug(`Connection failed with error ${err}`);
    });
};
exports.disconnectFromDB = (err) => {
    if (err === undefined) {
        console.log("start disconnecting");
        mongoose.disconnect().then(() => debug('Disconnected from MongoDB'))
            .catch(err => debug(err));
    }
    else
        throw err;
};
exports.dropCollectionMariochar = () => {
    return new Promise(((resolve, reject) => {
        mongoose.connection.db.dropCollection("mariochars")
            .then(isDeleted => {
            if (!isDeleted)
                throw new Error('failed to deleted collection:'
                    + 'mariochar');
            debug('deleted collection: mariochar');
            resolve();
        })
            .catch(err => { debug(err); reject(err); });
    }));
};
//# sourceMappingURL=connection.js.map