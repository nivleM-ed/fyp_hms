var express = require('express');
var router = express.Router();
var user = require('../controller/users');
let {isLoggedIn} = require('../middleware/authenticate');

/* GET users listing. */
router.post('/login', user.login);
router.post('/check_logged', isLoggedIn, user.check_logged);
router.post('/logout', isLoggedIn, user.logout);
router.get('/version', user.version);
router.post('/register', user.add_user);

module.exports = router;
