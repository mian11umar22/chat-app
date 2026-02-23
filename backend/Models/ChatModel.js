const mongoose = require("mongoose");
const chatschema = new mongoose.Schema({
    chatName: { type: String },
    isGroupChat: { type: Boolean, default: false },

    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true })
const Chat = mongoose.model("Chat", chatschema);
module.exports = Chat;