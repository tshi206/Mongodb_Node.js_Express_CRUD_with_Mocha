"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
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
        if (String(err).trim() === 'MongoError: ns not found')
            done();
        else
            throw err;
    });
});
//# sourceMappingURL=global_hooks.js.map