const router = require('express').Router(); //entri point dari page exprees
router.use('/auth', require('./auth'));
router.use('/komoditi', require('./komoditi'));

module.exports = router; //akan di gunakan di root folder