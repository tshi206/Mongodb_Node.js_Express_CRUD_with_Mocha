"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const BookSchema = new mongoose_1.Schema({
    title: String,
    pages: Number
});
const AuthorSchema = new mongoose_1.Schema({
    name: String,
    age: Number,
    books: [BookSchema]
});
const Author = mongoose.model('author', AuthorSchema);
module.exports = Author;
//# sourceMappingURL=author.js.map