import * as mongoose from "mongoose";
import {Schema} from "mongoose";

const BookSchema = new Schema({
    title : String,
    pages: Number
});

const AuthorSchema = new Schema({
    name : String,
    age: Number,
    books:[BookSchema]
});

const Author = mongoose.model('author', AuthorSchema);

module.exports = Author;
