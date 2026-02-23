import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

const ENDPOINT = "http://localhost:5000";

export const useSocket = () => {
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const newSocket = io(ENDPOINT);
        newSocket.emit("setup", user);
        setSocket(newSocket);

        return () => newSocket.close();
    }, [user]);

    return socket;
};
