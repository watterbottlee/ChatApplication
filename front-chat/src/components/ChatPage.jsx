import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import useChatContext from "../context/ChatContext";
import { getMessagess } from "../services/RoomService";
import { baseURL } from "../config/AxiosHelper";
import { formatTimestamp } from "../config/Helper";

const ChatPage = () => {
  const { roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser } = useChatContext();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);

  // Redirect to home if not connected
  useEffect(() => {
    if (!connected) {
      navigate("/");
    }
  }, [connected, navigate]);

  // Load previous messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const messagesData = await getMessagess(roomId);
        setMessages(messagesData);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    if (connected) {
      loadMessages();
    }
  }, [roomId, connected]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const sock = new SockJS(`${baseURL}/chat`);
      const client = Stomp.over(sock);
      
      client.connect({}, () => {
        setStompClient(client);
        toast.success("Connected to chat room");
        
        client.subscribe(`/topic/room/${roomId}`, (message) => {
          const newMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        });
      });
    };

    if (connected) {
      connectWebSocket();
    }
    
    // Cleanup function
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, [roomId, connected]);

  // Send message handler
  const sendMessage = () => {
    if (stompClient && connected && input.trim()) {
      const message = {
        sender: currentUser,
        content: input,
        roomId: roomId
      };
      
      stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
      setInput("");
      
      // Focus back on input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Handle logout/leave room
  const handleLogout = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
    setConnected(false);
    setCurrentUser("");
    setRoomId("");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen dark:bg-black-700 dark:text-white">
      {/* Header/Navbar */}
      <header className="fixed w-full h-16 border-b dark:border-gray-800 dark:bg-gray-800 rounded-b-lg shadow-md flex items-center justify-between px-8 z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">
            Room: <span className="text-green-500">{roomId}</span>
          </h1>
        </div>

        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">
            User: <span className="text-purple-500">{currentUser}</span>
          </h1>
        </div>

        <button 
          onClick={handleLogout} 
          className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700 px-4 py-2 rounded-full transition-colors duration-200"
        >
          Leave Room
        </button>
      </header>

      {/* Chat Messages Area */}
      <main 
        ref={chatBoxRef}
        className="   py-20 pb-24 w-2/3 mx-auto h-screen overflow-auto px-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200
        bg-white-100 dark:bg-gray-900 rounded-lg"
      >
        <div className="flex flex-col space-y-2">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.sender === currentUser ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`my-2 ${message.sender === currentUser ? "bg-green-700" : "bg-gray-700"} 
                p-3 max-w-xs rounded-lg shadow-md`}
              >
                <div className="flex items-start space-x-2">
                  <img 
                    className="h-10 w-10 rounded-full" 
                    src="https://avatar.iran.liara.run/public/49" 
                    alt="User avatar" 
                  />
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold">{message.sender}</p>
                    <p className="text-md break-words">{message.content}</p>
                    <p className="text-xs text-gray-400">{formatTimestamp(message.timestamp)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Message Input Area */}
      <div className="fixed bottom-4 w-full">
        <div className="h-14 pr-2 gap-2 flex items-center justify-between rounded-full w-2/3 mx-auto dark:bg-gray-900 shadow-lg border dark:border-gray-700">
          <input 
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            type="text" 
            placeholder="Type your message here..." 
            className="w-full px-5 py-3 rounded-full h-full focus:outline-none dark:bg-gray-900 dark:text-white" 
          />
          
          <div className="flex gap-2">
            <button className="dark:bg-purple-700 hover:dark:bg-purple-800 h-10 w-10 flex justify-center items-center rounded-full transition-colors duration-200">
              <MdAttachFile size={24} />
            </button>
            <button 
              onClick={sendMessage}  
              className="dark:bg-green-700 hover:dark:bg-green-800 h-10 w-10 flex justify-center items-center rounded-full transition-colors duration-200"
            >
              <MdSend size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;