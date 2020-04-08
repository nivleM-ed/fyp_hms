var express = require('express');
var router = express.Router();
var expenses = require('../controller/expenses');
let {isLoggedIn} = require('../middleware/authenticate');

//INSERT ROUTES HERE
router.post('/update', expenses.update);
router.get('/get', expenses.get);

module.exports = router;