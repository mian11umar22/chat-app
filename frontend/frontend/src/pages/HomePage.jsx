import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useChat } from "../context/ChatContext";

const HomePage = () => {
    const { selectedChat } = useChat();

    return (
        <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {!selectedChat ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-10 bg-[#f0f2f5] border-b-8 border-[#00a884]">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                            alt="WA"
                            className="w-24 opacity-20 mb-6"
                        />
                        <h1 className="text-3xl font-light text-[#41525d] mb-4">WhatsApp Web Clone</h1>
                        <p className="text-[#667781] max-w-md">
                            Send and receive messages without keeping your phone online. Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
                        </p>
                    </div>
                ) : (
                    <ChatWindow />
                )}
            </div>
        </div>
    );
};

export default HomePage;
