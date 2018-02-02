import {Document} from "mongoose";
const MarioChar = require('../models/mariochar');

export let makeMarioChar = (char: Object) => {
    return new MarioChar(char);
};

export let prepareDB = (chars: Document[]) => {
    return Promise.all(chars.map(char => {return char.save()}))
        .catch(err => {throw err})
};

// returns a Document in the collection based on MarioChar
export let findOne = (obj : Object) => {
    return MarioChar.findOne(obj).exec()
};
