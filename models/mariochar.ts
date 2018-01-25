import * as mongoose from "mongoose";
import {Schema} from "mongoose";

// Create schema
// Unlike relational database, the schema in NoSQL Database is NOT strictly
// enforced. Hence, it is OPTIONAL for a record to conform to a particular
// schema, however, if the record does have a property matches one of the
// properties implied by the schema, then the type of that property must conform
// to the typing established in the schema.
// For example, a MarioChar record does not need to have a 'weight' property,
// if it does have one then that must be of type Number.
const MarioCharSchema = new Schema({
    name : String,
    weight: Number,
});

// Create Model with a collection name 'mariochar', based on MarioCharSchema
// persist data via this model will enforce the data to be persisted in the
// collection 'mariochar' and with properties expected by MarioCharSchema (
// note that schemata are NOT strictly enforced in NoSQL DB)
const MarioChar = mongoose.model('mariochar', MarioCharSchema);

exports = MarioChar;