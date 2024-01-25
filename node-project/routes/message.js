const { store, getMessages } = require("../controller/MessageController");

const router = require('express').Router();


router.get('/get/:id', getMessages);
router.post('/send', store);


module.exports = router;