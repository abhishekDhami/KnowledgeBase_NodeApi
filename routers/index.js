const router = require('express').Router();

//Centralizing Routes
router.use( require('./userProfileRoutes'));
router.use( require('./baseAppRoutes'));


module.exports = router;