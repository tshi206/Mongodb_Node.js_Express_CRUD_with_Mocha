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
/**
 * Additional info about option - strict:
 *  option: strict
 * The strict option, (enabled by default), ensures that values passed to our model
 * constructor that were not specified in our schema do not get saved to the db.
 *
 *      var thingSchema = new Schema({..})
 *      var Thing = mongoose.model('Thing', thingSchema);
 *      var thing = new Thing({ iAmNotInTheSchema: true });
 *      thing.save(); // iAmNotInTheSchema is not saved to the db

 // set to false..
 *      var thingSchema = new Schema({..}, { strict: false });
 *      var thing = new Thing({ iAmNotInTheSchema: true });
 *      thing.save(); // iAmNotInTheSchema is now saved to the db!!
 *
 * NOTE: Any key/val set on the instance that does not exist in your schema
 * is always ignored, regardless of schema option.
 *
 *      var thingSchema = new Schema({..})
 *      var Thing = mongoose.model('Thing', thingSchema);
 *      var thing = new Thing;
 *      thing.iAmNotInTheSchema = true;
 *      thing.save(); // iAmNotInTheSchema is never saved to the db
 *
 * For more read: http://mongoosejs.com/docs/guide.html#strict
 */
const MarioCharSchema = new Schema({
    name : String,
    weight: Number
});

// Create Model with a collection name 'mariochars', based on MarioCharSchema
// Persist data via this model will enforce the data to be persisted in the
// collection 'mariochars' and with properties expected by MarioCharSchema (
// note that schemata are NOT strictly enforced in NoSQL DB)
/*
    IMPORTANT:
    if the collection name has not been explicitly specified as the third parameter,
     mongoose will generate the collection with a name INDUCED by the model name:
            Induced collection name === <model_name> + 's' (all in lowercase)
     Hence the induced collection name for model 'mariochar' would be 'mariochars'
     To explicitly specify the Collection name use the following:
            mongoose.model('mariochar', MarioCharSchema, <Collection_Name>);
     The code below DOES NOT specify the collection name, therefore, the following
     is equivalent to:
            const MarioChar = mongoose.model
            ('mariochar', MarioCharSchema, 'mariochars');
 */
const MarioChar = mongoose.model('mariochar', MarioCharSchema);

module.exports = MarioChar;