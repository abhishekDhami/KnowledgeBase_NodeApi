const multer = require('multer');
 
var storage = multer.memoryStorage()
var multer_upload = multer({storage: storage});
 
module.exports = multer_upload;