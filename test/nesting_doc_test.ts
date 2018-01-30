import * as assert from "assert";
import {equal} from "assert";

const Author = require("../models/author");

describe('Testing nested documents in \'authors\' collection', () => {

    // savePatrick :: () => Promise<T> | Promise<MongoError>
    let savePatrick = () => {
        return new Author({name : 'Patrick Rothfuss',
            books:[
                {title : 'Name of the Wind', pages: 400}
                ]}).save()
    };

    afterEach("Removes 'authors' collection after each test", done => {
        Author.collection.drop()//.then(JSON.stringify)
            .then(value => {return value === true ? "dropping 'authors' collection" : value})
            .then(console.log).then(done)
            .catch(err => {throw err})
    });

    it('Saves a document with a sub-document inside', function (done) {
        savePatrick().then(result => {
            equal(result.name, 'Patrick Rothfuss');
            equal(result.books.length, 1);
            equal(result.books[0].title, 'Name of the Wind');
            assert(result.books[0].pages === 400)
        }).then(done).catch(err => {throw err})
    });

    it('Adds a new sub-document to an existing Author record', function (done) {
        savePatrick().then(result => {
            result.books.push({title: 'Wise Man\'s Fear', pages: 500});
            return result.save()
        }).then(updatedResult => {
            equal(updatedResult.books.length, 2);
            equal(updatedResult.books[1].title, "Wise Man's Fear");
            assert(updatedResult.books[1].pages === 500)
        }).then(() => {return Author.find().count()})
            .then(collectionLength => equal(collectionLength, 1))
            .then(done).catch(err => {throw err})
    });

    it('Finds an Author who wrote \'Name of the Wind\'', function (done) {
        savePatrick().then(() => {
            return Author.find({"books.title" : "Name of the Wind"})
        }).then(results => {
            console.log(results);
            // note that find(...) returns an Array of Documents
            equal(results.length, 1);
            equal(results[0].books.length, 1);
            equal(results[0].books[0].title, 'Name of the Wind');
            equal(results[0].books[0].pages, 400);
            equal(results[0].name, 'Patrick Rothfuss')
        }).then(done).catch(err => {throw err})
    });

});