"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MarioChar = require('../models/mariochar');
exports.makeMarioChar = (char) => {
    return new MarioChar(char);
};
exports.prepareDB = (chars) => {
    return Promise.all(chars.map(char => { return char.save(); }))
        .catch(err => { throw err; });
};
// returns a Document in the collection based on MarioChar
exports.findOne = (obj) => {
    return MarioChar.findOne(obj).exec();
};
//# sourceMappingURL=db.js.map