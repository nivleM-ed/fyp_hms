var express = require('express');
var router = express.Router();
var expenses = require('../controller/expenses');
let {isLoggedIn} = require('../middleware/authenticate');

//INSERT ROUTES HERE
router.post('/update', isLoggedIn, expenses.update);
router.get('/get', isLoggedIn, expenses.get);

module.exports = router;