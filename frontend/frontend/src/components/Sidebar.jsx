import { useState } from "react";
import SearchBox from "./SearchBox";
import GroupModal from "./GroupModal";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const { chats, selectedChat, setSelectedChat } = useChat();
    const { user, logout } = useAuth();
    const [showGroupModal, setShowGroupModal] = useState(false);

    return (
        <div className="w-1/3 h-screen bg-white border-r flex flex-col relative">
            {/* Header */}
            <div className="bg-[#f0f2f5] p-4 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#00a884] text-white rounded-full flex items-center justify-center font-bold">
                        {user?.name?.[0].toUpperCase()}
                    </div>
                    <span className="font-medium text-[#111b21]">{user?.name}</span>
                </div>
                <div className="flex items-center space-x-4">
                    {/* New Group Button */}
                    <button
                        onClick={() => setShowGroupModal(true)}
                        className="text-[#54656f] hover:bg-gray-200 p-2 rounded-full transition"
                        title="New Group"
                    >
                        <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor"><path d="M12,14c2.206,0,4-1.794,4-4s-1.794-4-4-4s-4,1.794-4,4S9.794,14,12,14z M12,8c1.103,0,2,0.897,2,2s-0.897,2-2,2 s-2-0.897-2-2S10.897,8,12,8z M12,16c-2.673,0-8,1.337-8,4v2h16v-2C20,17.337,14.673,16,12,16z M6.182,20c0.412-0.565,2.711-1.346,5.818-1.346 c3.107,0,5.405,0.781,5.818,1.346H6.182z"></path></svg>
                    </button>
                    <button
                        onClick={logout}
                        className="text-sm text-red-500 font-bold hover:underline"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* User Search Area */}
            <SearchBox />

            {/* Chat List */}
            <div className="overflow-y-auto flex-1">
                {chats.length === 0 ? (
                    <div className="p-10 text-center text-[#667781] text-sm">
                        <p>No chats yet.</p>
                        <p className="mt-2 text-[11px]">Enter a User ID above to start messaging!</p>
                    </div>
                ) : (
                    chats.map((chat) => {
                        const otherParticipant = chat.participants?.find(p => (p._id || p.id || p) !== (user?._id || user?.id));
                        const chatName = chat.isGroupChat ? chat.chatName : otherParticipant?.name;
                        const initial = (chat.isGroupChat ? chat.chatName?.[0] : otherParticipant?.name?.[0]) || "?";

                        return (
                            <div
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                className={`flex items-center p-3 cursor-pointer hover:bg-[#f5f6f6] transition ${selectedChat?._id === chat._id ? "bg-[#f0f2f5]" : ""
                                    }`}
                            >
                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500 mr-4">
                                    {initial.toUpperCase()}
                                </div>
                                <div className="flex-1 border-b pb-3 border-gray-100">
                                    <h3 className="font-medium text-[#111b21]">
                                        {chatName || "Direct Chat"}
                                    </h3>
                                    <p className="text-xs text-[#667781] truncate">
                                        {chat.lastMessage?.content || "Tap to chat"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Group Modal Portal */}
            {showGroupModal && <GroupModal onClose={() => setShowGroupModal(false)} />}
        </div>
    );
};

export default Sidebar;
