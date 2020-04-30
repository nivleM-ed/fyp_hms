var express = require('express');
var router = express.Router();
var notification = require('../controller/notification');
let {isLoggedIn} = require('../middleware/authenticate');

//INSERT ROUTES HERE
router.post('/update', isLoggedIn, notification.update);
router.get('/get', isLoggedIn, notification.get);

module.exports = router;