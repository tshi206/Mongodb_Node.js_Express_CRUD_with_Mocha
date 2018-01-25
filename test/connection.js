"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const debug = require('debug')('mongodb-node.js-express-crud-with-mocha:connection');
const MarioChar = require('../models/mariochar');
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
//# sourceMappingURL=connection.js.map