var express = require('express');
var router = express.Router();
var inventory = require('../controller/inventory');
let {isLoggedIn} = require('../middleware/authenticate');

//INSERT ROUTES HERE
router.post('/update', inventory.update);
router.get('/get', inventory.get);

module.exports = router;