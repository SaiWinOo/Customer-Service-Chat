const express = require('express');
const router = express.Router();
const { createOrReturnChat, getMyChats, getSingleChat } = require('../controller/ConversationController');

router.get('/', getMyChats)
router.get('/conversation/:id', getSingleChat)
router.post('/:id', createOrReturnChat);

module.exports = router;