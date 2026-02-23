import { createContext, useState, useContext, useEffect } from "react";
import API from "../api/config";
import { useAuth } from "./AuthContext";
import { useSocket } from "../socket/useSocket";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const { user } = useAuth();
    const socket = useSocket();

    const fetchChats = async () => {
        try {
            const { data } = await API.get("/chat/AllChats");
            setChats(data.chats);
        } catch (error) {
            console.error("Error fetching chats", error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchChats();
        } else {
            // Reset state on logout
            setChats([]);
            setSelectedChat(null);
            setMessages([]);
        }
    }, [user]);

    useEffect(() => {
        if (!socket) return;
        socket.on("chatReceived", (newChat) => {
            fetchChats();
        });
        socket.on("receiveMessage", (message) => {
            fetchChats();
        });
        return () => {
            socket.off("chatReceived");
            socket.off("receiveMessage");
        };
    }, [socket]);

    return (
        <ChatContext.Provider value={{
            chats,
            setChats,
            selectedChat,
            setSelectedChat,
            messages,
            setMessages,
            setMessages,
            fetchChats,
            socket
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
