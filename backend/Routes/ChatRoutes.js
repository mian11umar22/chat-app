const express = require("express");
const router = express.Router();
const ChatController = require("../Controller/ChatController")
const AuthMiddleware = require("../Middleware/authMiddleware")
router.post("/createchat", AuthMiddleware,ChatController.createChat);
router.get("/AllChats", AuthMiddleware,ChatController.AllChats);
router.post("/GroupChat",AuthMiddleware, ChatController.GroupChat);
module.exports = router;