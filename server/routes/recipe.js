var express = require('express');
var router = express.Router();
var recipe = require('../controller/recipe');
let {isLoggedIn} = require('../middleware/authenticate');

router.post('/add', isLoggedIn, recipe.add);
router.post('/update', isLoggedIn, recipe.update);
router.post('/search', isLoggedIn, recipe.search);
router.post('/delete', isLoggedIn, recipe.delete);

module.exports = router;
