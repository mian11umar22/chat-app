const express = require("express")
const router = express.Router()
const { sendMessage, getMessages } = require("../Controller/MessageController")
const AuthMiddleware = require("../Middleware/authMiddleware")

router.post("/send", AuthMiddleware, sendMessage)
router.get("/:chatid", AuthMiddleware, getMessages)
module.exports = router