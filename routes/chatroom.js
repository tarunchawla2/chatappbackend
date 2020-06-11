const express = require('express');
const router = express.Router();
const ChatroomController = require('../controllers/chatroom');

router.get("/:room", ChatroomController.getAllMessages);

module.exports = router;