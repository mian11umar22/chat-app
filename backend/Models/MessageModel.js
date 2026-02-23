const mongoose = require("mongoose")
const MessageSchema =new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    content: { type: String, required: true }
}, { timestamps: true })
const Message = mongoose.model("Message", MessageSchema);
module.exports = Message