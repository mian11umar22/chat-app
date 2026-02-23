import { useState } from "react";
import API from "../api/config";
import { useChat } from "../context/ChatContext";

const GroupModal = ({ onClose }) => {
    const [chatName, setChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const [loading, setLoading] = useState(false);

    const { fetchChats, socket } = useChat();

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        try {
            const { data } = await API.get(`/auth/users?search=${query}`);
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed");
        }
    };

    const toggleParticipant = (user) => {
        if (selectedParticipants.find(p => p._id === user._id)) {
            setSelectedParticipants(selectedParticipants.filter(p => p._id !== user._id));
        } else {
            setSelectedParticipants([...selectedParticipants, user]);
        }
    };

    const handleCreateGroup = async () => {
        if (!chatName || selectedParticipants.length < 2) {
            alert("Please provide a name and at least 2 participants");
            return;
        }

        setLoading(true);
        try {
            const { data } = await API.post("/chat/GroupChat", {
                chatName,
                participants: selectedParticipants.map(p => p._id)
            });

            if (socket) {
                socket.emit("newChat", data.chat);
            }

            fetchChats();
            onClose();
        } catch (error) {
            const errMsg = error.response?.data?.message || "Something went wrong";
            alert("Error: " + errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[#111b21]">New Group</h2>
                    <button onClick={onClose} className="text-[#54656f] hover:bg-gray-100 p-1 rounded-full text-xl shadow-xs">×</button>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00a884] uppercase">Group Subject</label>
                        <input
                            type="text"
                            placeholder="What is this group about?"
                            value={chatName}
                            onChange={(e) => setChatName(e.target.value)}
                            className="w-full p-3 border-b-2 border-gray-100 outline-none focus:border-[#00a884] transition-colors"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-[#00a884] uppercase">Add Participants</label>
                        <input
                            type="text"
                            placeholder="Search name or email"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full p-3 bg-[#f0f2f5] rounded-lg outline-none text-sm placeholder:text-gray-500"
                        />
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <div className="max-h-40 overflow-y-auto border rounded-lg divide-y bg-white">
                            {searchResults.map(user => (
                                <div
                                    key={user._id}
                                    onClick={() => toggleParticipant(user)}
                                    className={`flex items-center p-2 cursor-pointer transition ${selectedParticipants.find(p => p._id === user._id) ? "bg-[#d9fdd3]" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="w-8 h-8 bg-[#00a884] text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                        {user.name[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{user.name}</p>
                                        <p className="text-[10px] text-gray-500">{user.email}</p>
                                    </div>
                                    {selectedParticipants.find(p => p._id === user._id) && (
                                        <span className="text-[#00a884] font-bold text-xs">✓</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Selected Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {selectedParticipants.map(user => (
                            <span key={user._id} className="bg-[#e7fed3] text-[#111b21] px-3 py-1 rounded-full text-xs flex items-center shadow-sm border border-[#00a884]/20 animate-in fade-in slide-in-from-bottom-1">
                                {user.name}
                                <button onClick={() => toggleParticipant(user)} className="ml-2 text-red-500 hover:text-red-700 font-bold px-1">×</button>
                            </span>
                        ))}
                    </div>

                    <div className="flex justify-end space-x-3 mt-8">
                        <button onClick={onClose} className="px-5 py-2 text-[#54656f] font-medium hover:bg-gray-50 rounded-lg transition">Cancel</button>
                        <button
                            onClick={handleCreateGroup}
                            disabled={loading || selectedParticipants.length < 2}
                            className="bg-[#00a884] text-white px-8 py-2 rounded-full font-bold shadow-md hover:bg-[#008f70] disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-95"
                        >
                            {loading ? "Creating..." : "Create Group"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupModal;
