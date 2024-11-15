"use client"
import ChatService from "@/firebase/chat";
import { createContext, useContext, useEffect, useState } from "react"

const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {
    const [chatData, setChatData] = useState(null)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (chatData?.chatId) {
            const unsubscribe = ChatService.getMessages(chatData.chatId, (data) => {
                setMessages(data || []);
                setLoading(false)
              });
            return () => unsubscribe();
        }
    }, [chatData?.chatId]);

    return (
        <ChatContext.Provider value={{ chatData, setChatData, messages, loading }}>
            {children}
        </ChatContext.Provider >
    )
};

export const useChat = () => useContext(ChatContext);