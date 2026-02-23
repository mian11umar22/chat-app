import { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../socket/useSocket";
import API from "../api/config";
import EmojiPicker from "emoji-picker-react";

const ChatWindow = () => {
    const { selectedChat, messages, setMessages, socket, fetchChats } = useChat();
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [typingStatus, setTypingStatus] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const scrollRef = useRef();

    // Fetch messages and Join Chat Room
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedChat) return;
            try {
                const { data } = await API.get(`/message/${selectedChat._id}`);
                setMessages(data.Message);

                if (socket) {
                    socket.emit("joinchat", selectedChat._id);
                }
            } catch (error) {
                console.error("Error fetching messages", error);
            }
        };

        fetchMessages();
    }, [selectedChat, socket]);

    // Listen for Real-time Events
    useEffect(() => {
        if (!socket) return;

        socket.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("typing", () => setTypingStatus("typing..."));
        socket.on("stopTyping", () => setTypingStatus(""));

        return () => {
            socket.off("receiveMessage");
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [socket]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        socket.emit("stopTyping", selectedChat._id);
        setShowEmojiPicker(false);

        try {
            const { data } = await API.post("/message/send", {
                chatid: selectedChat._id,
                content: newMessage,
            });

            const sentMessage = data.Message;
            setMessages((prev) => [...prev, sentMessage]);
            setNewMessage("");

            if (socket) {
                socket.emit("sendMessage", {
                    chatId: selectedChat._id,
                    message: sentMessage,
                });
            }
            fetchChats(); // Update own sidebar last message
        } catch (error) {
            console.error("Error sending message", error);
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socket) return;

        if (!isTyping) {
            setIsTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && isTyping) {
                socket.emit("stopTyping", selectedChat._id);
                setIsTyping(false);
            }
        }, timerLength);
    };

    const onEmojiClick = (emojiData) => {
        setNewMessage((prev) => prev + emojiData.emoji);
    };

    return (
        <div className="flex-1 flex flex-col h-screen relative">
            {/* Header */}
            <div className="bg-[#f0f2f5] p-3 flex items-center border-l border-gray-300 shadow-sm z-10">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-xl text-gray-500 mr-3 underline decoration-[#00a884]">
                    {(!selectedChat.isGroupChat
                        ? selectedChat.participants?.find((p) => p._id !== user.id)?.name?.[0] || "?"
                        : selectedChat.chatName?.[0] || "?"
                    ).toUpperCase()}
                </div>
                <div className="flex-1">
                    <h3 className="font-medium text-[#111b21]">
                        {selectedChat.isGroupChat
                            ? selectedChat.chatName
                            : selectedChat.participants?.find((p) => p._id !== user.id)?.name || "Unknown User"}
                    </h3>
                    <p className={`text-xs ${typingStatus ? "text-[#00a884] font-bold italic" : "text-[#667781]"}`}>
                        {typingStatus || "online"}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#efeae2] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
                {messages.map((msg, idx) => {
                    const isMine = msg.sender === user.id || msg.sender?._id === user.id;
                    const senderName = msg.sender?.name || "Unknown";

                    return (
                        <div key={msg._id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-[70%] p-2 rounded-lg text-sm shadow-sm relative ${isMine ? "bg-[#d9fdd3] text-[#111b21]" : "bg-white text-[#111b21]"
                                    }`}
                            >
                                {/* Sender Name for Group Chats */}
                                {selectedChat.isGroupChat && !isMine && (
                                    <p className="text-[10px] font-bold text-[#00a884] mb-1">
                                        {senderName}
                                    </p>
                                )}
                                <p>{msg.content}</p>
                                <p className="text-[10px] text-[#667781] text-right mt-1 uppercase">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <div className="absolute bottom-16 left-4 z-50">
                    <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                </div>
            )}

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="bg-[#f0f2f5] p-3 flex items-center space-x-2 relative z-10">
                <div
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="cursor-pointer text-[#54656f] text-2xl px-2 hover:bg-gray-200 rounded-full p-1"
                >
                    😊
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={typingHandler}
                    placeholder="Type a message"
                    className="flex-1 p-2 rounded-lg bg-white outline-none border-none text-sm placeholder:text-gray-500 shadow-sm"
                />
                <button type="submit" className="text-[#54656f] p-2 hover:bg-gray-200 rounded-full transition">
                    <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor">
                        <path d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path>
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;
