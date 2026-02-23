const Chat = require("../Models/ChatModel")
const createChat = async (req, res) => {
    const userid = req.body.id
    const ourid = req.user.id
    if (!userid) {
        return res.status(400).json({
            message: "user id Required"
        })
    }
    try {
        const findchat = await Chat.findOne({
            isGroupChat: false,
            participants: { $all: [userid, ourid] }
        })
        if (findchat) {
            const populatedChat = await findchat.populate("participants", "name email");
            return res.status(200).json({
                chat: populatedChat
            })
        }
        const createchat = await Chat.create({
            isGroupChat: false,
            participants: [userid, ourid]

        })

        const fullChat = await Chat.findById(createchat._id).populate("participants", "name email");

        return res.status(200).json({
            chat: fullChat
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}
const AllChats = async (req, res) => {
    const userid = req.user.id
    if (!userid) {
        return res.status(400).json({
            message: "user id Required"
        })
    }
    try {
        const findchats = await Chat.find({
            participants: userid
        }).populate("participants", "name email").populate("lastMessage").sort({ updatedAt: -1 })
        return res.status(200).json({
            chats: findchats
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}
const GroupChat = async (req, res) => {
    const participants = req.body.participants

    const ourid = req.user.id
    const chatName = req.body.chatName
    if (!participants || !chatName) {
        return res.status(400).json({
            message: "users id and ChatName are Required"
        });
    }
    if (participants.length < 2) {
        return res.status(400).json({
            message: "Group me kam se kam 2 members chahiye"
        })
    }
    try {
        const CreateGroupChat = await Chat.create({
            participants: [...participants, ourid],
            groupAdmin: ourid,
            isGroupChat: true,
            chatName: chatName
        })
        const fullGroupChat = await Chat.findById(CreateGroupChat._id)
            .populate("participants", "name email")
            .populate("groupAdmin", "name email");

        return res.status(200).json({
            chat: fullGroupChat
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}
module.exports = { createChat, AllChats, GroupChat }
