const express = require('express');
const router = express.Router();
import * as db from '../utils/db';

/* GET MarioChar Document from DB. */
// note that the root url for this particular router is '/chars'
// hence the full url listened by this router is: '/chars/:name'
// see "app.use('/chars', chars)" in app.js
router.get('/:name', function(req, res, next) {
    db.findOne({name: String(req.params.name)}).then(result => {
        return res.json(result)
    }).catch(err => {res.send(err); throw err})
});

module.exports = router;