var express = require('express');
var router = express.Router();
var tasks = require('../controller/tasks');
let {isLoggedIn} = require('../middleware/authenticate');

//INSERT ROUTES HERE
router.post('/update', isLoggedIn, tasks.update);
// router.post('/complete_update', isLoggedIn, tasks.update_complete);
router.get('/get', isLoggedIn, tasks.get);

module.exports = router;