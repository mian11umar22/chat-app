const Message = require('../Models/MessageModel')
const Chat = require("../Models/ChatModel")
const sendMessage = async (req, res) => {
    const { chatid, content } = req.body
    const ourid = req.user.id
    if (!chatid || !content) {
        return res.status(400).json({
            Message: "Chat id and content must be rquired"
        });
    }
    try {
        const createmessages = await Message.create({
            sender: ourid,
            chat: chatid,
            content: content
        })

        const updatelastmessage = await Chat.findByIdAndUpdate(chatid, {
            lastMessage: createmessages._id
        })

        const fullMessage = await Message.findById(createmessages._id).populate("sender", "name email");

        return res.status(200).json({
            Message: fullMessage,
            lastMessage: updatelastmessage
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}
const getMessages = async (req, res) => {
    const chatid = req.params.chatid
    if (!chatid) {
        return res.status(400).json({
            Message: "Chat id  be rquired"
        });
    }
    try {
        const getmessage = await Message.find({ chat: chatid }).populate("sender", "name email").sort({ createdAt: 1 })
        return res.status(200).json({
            Message: getmessage
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
module.exports = { sendMessage, getMessages }