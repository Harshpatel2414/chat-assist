"use client";

import { useEffect, useRef, useState } from "react";
import { Input, Avatar, Button, Typography, Select, List } from "antd";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { doc, collection, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // replace with actual firebase config import
import { useAuth } from "@/context/AuthContext";
import AssistantInput from "./AssistantInput";
import MessageWithMedia from "../chat/MessageWithMedia";
import Message from "../chat/Message";

const Assistant = () => {
    const [messages, setMessages] = useState([]);
    const { currentUser } = useAuth();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };

      useEffect(() => {
        if (messages && messages.length > 0) {
          const scrollTimeout = setTimeout(() => {
            scrollToBottom();
          }, 100);
    
          return () => clearTimeout(scrollTimeout);
        }
      }, [messages]);

    // Reference to the user's chat document and the messages subcollection
    const chatDocRef = doc(db, "Chats", currentUser.uid);
    const messagesCollectionRef = collection(chatDocRef, "messages");

    // Fetch messages in real-time
    useEffect(() => {
        if (!currentUser) return;

        // Query the messages subcollection, ordering by 'date'
        const messagesQuery = query(messagesCollectionRef, orderBy("date", "asc"));
        const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const msgs = snapshot.docs.map((doc) => doc.data());
            if (msgs.length < 1) {
                // Add a default message if no messages exist
                setMessages([{
                    senderId: 'bot',
                    text: "I'm happy to chat and answer any questions. To better assist you, have you used our software before, or is this your first time?",
                    date: Date.now(),
                }]);
            } else {
                setMessages(msgs);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="fixed bottom-20 right-8 w-[360px] md:w-[400px] h-[500px] overflow-hidden drop-shadow-md rounded-lg flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-3 drop-shadow-md bg-blue-500 dark:bg-gray-700 text-white rounded-t-lg">
                <div className="flex items-center">
                    <Avatar size="small" icon={<CustomerServiceOutlined />} className="mr-2 bg-blue-700" />
                    <Typography.Text className="font-semibold text-white">LiveChat Assistant</Typography.Text>
                </div>
            </div>

            {/* Messages List */}
            <div className="p-4 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 hide-scrollbar">
                {messages.map((msg, index) => (<Message key={msg.id} message={msg} isLastMessage={index === messages.length - 1} />
                
                    // <div
                    //     key={index}
                    //     className={`flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"} my-2`}
                    // >
                    //     {msg.senderId !== currentUser.uid && (
                    //         <Avatar size="small" icon={<CustomerServiceOutlined />} className="mr-2 bg-blue-500" />
                    //     )}
                    //     <div
                    //         className={`${msg.senderId === currentUser.uid
                    //                 ? "bg-blue-500 text-white rounded-tr-none w-fit"
                    //                 : "bg-gray-200 text-gray-800 rounded-tl-none w-fit"
                    //             } py-2 px-3 rounded-lg max-w-xs `}
                    //     >
                    //         {msg.text}
                    //     </div>
                    // </div>
                ))}
               <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <AssistantInput />
        </div>
    );
};

export default Assistant;
