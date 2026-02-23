import { useState } from "react";
import API from "../api/config";
import { useChat } from "../context/ChatContext";

const SearchBox = () => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { setSelectedChat, fetchChats, socket } = useChat();

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearch(query);

        if (!query.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const { data } = await API.get(`/auth/users?search=${query}`);
            setResults(data);
        } catch (error) {
            console.error("Search error", error);
        } finally {
            setLoading(false);
        }
    };

    const startChat = async (userId) => {
        try {
            const { data } = await API.post("/chat/createchat", { id: userId });
            setSelectedChat(data.chat);
            if (socket) {
                socket.emit("newChat", data.chat);
            }
            fetchChats(); // Refresh sidebar list
            setResults([]);
            setSearch("");
        } catch (error) {
            console.error("Error creating chat", error);
        }
    };

    return (
        <div className="p-3 border-b relative">
            <div className="bg-[#f0f2f5] rounded-xl flex items-center p-2">
                <svg viewBox="0 0 24 24" height="24" width="24" className="text-[#54656f] ml-2"><path fill="currentColor" d="M15.009,13.805h-0.636l-0.22-0.22c0.789-0.918,1.264-2.103,1.264-3.392c0-2.88-2.335-5.215-5.215-5.215c-2.88,0-5.215,2.335-5.215,5.215 c0,2.88,2.335,5.215,5.215,5.215c1.289,0,2.474-0.475,3.392-1.264l0.22,0.22v0.636l4.009,3.991l1.191-1.191L15.009,13.805z M10.202,13.805c-1.983,0-3.603-1.62-3.603-3.603s1.62-3.603,3.603-3.603s3.603,1.62,3.603,3.603S12.185,13.805,10.202,13.805z"></path></svg>
                <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search name or email"
                    className="bg-transparent w-full outline-none text-sm px-3 placeholder:text-gray-500"
                />
                {loading && <div className="animate-spin h-4 w-4 border-2 border-[#00a884] border-t-transparent rounded-full mr-2"></div>}
            </div>

            {/* Results Dropdown */}
            {results.length > 0 && (
                <div className="absolute left-0 right-0 top-full bg-white z-50 shadow-lg border-x border-b max-h-60 overflow-y-auto">
                    {results.map(user => (
                        <div
                            key={user._id}
                            onClick={() => startChat(user._id)}
                            className="flex items-center p-3 cursor-pointer hover:bg-[#f5f6f6] transition border-b border-gray-50"
                        >
                            <div className="w-10 h-10 bg-[#00a884] text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                                {user.name[0].toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-[#111b21]">{user.name}</p>
                                <p className="text-xs text-[#667781]">{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBox;
