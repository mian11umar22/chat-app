const socketHandler = (io) => {
    io.on("connection", (socket) => {
        let currentUser = null;
        console.log("🟢 User connected:", socket.id);

        socket.on("setup", (userData) => {
            currentUser = userData;
            const userId = (userData._id || userData.id)?.toString();
            if (userId) {
                socket.join(userId);
                console.log(`🏠 User ${userData.name} joined room: ${userId}`);
                socket.emit("connected");
            }
        });

        socket.on("joinchat", (chatId) => {
            socket.join(chatId);
            console.log("💬 Joined chat room:", chatId);
        });

        socket.on("newChat", (chat) => {
            if (!chat || !chat.participants) return;
            const currentUserId = (currentUser?._id || currentUser?.id)?.toString();
            console.log(`🆕 newChat event from ${currentUser?.name || "Unknown"}`);

            chat.participants.forEach(participant => {
                const participantId = (participant._id || participant)?.toString();
                if (participantId === currentUserId) return;

                console.log(`📤 Emitting chatReceived to participant: ${participantId}`);
                io.to(participantId).emit("chatReceived", chat);
            });
        });

        socket.on("sendMessage", (messagedata) => {
            if (!messagedata || !messagedata.chatId) return;
            console.log(`📩 Message in chat ${messagedata.chatId}`);
            socket.to(messagedata.chatId).emit("receiveMessage", messagedata.message);
        });

        socket.on("typing", (chatId) => {
            socket.to(chatId).emit("typing");
        });

        socket.on("stopTyping", (chatId) => {
            socket.to(chatId).emit("stopTyping");
        });

        socket.on('disconnect', () => {
            console.log('❌ User disconnected:', socket.id);
        });
    });
};

module.exports = socketHandler;