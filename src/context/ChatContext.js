"use client"
import { db } from "@/firebase/firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react"

export const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {
    const [chatData, setChatData] = useState(null)
    const [messages,setMessages] = useState([])
    const router = useRouter()
    
    useEffect(()=>{
        if(!chatData){
            router.push('/chat')
        }
    },[])

    useEffect(() => {
        if (!chatData) {
          router.push('/chat')
        } else {
          const unSub = onSnapshot(doc(db, 'Chats', chatData.chatId), (doc) => {
            if (doc.exists()) {
              setMessages(doc.data().messages);
            } else {
              setMessages([]);
            }
          });
    
          return () => unSub();
        }
      }, [chatData?.chatId]);

    return (
        <ChatContext.Provider value={{ chatData,setChatData ,messages}}>
            {children}
        </ChatContext.Provider >
    )
};

export const useChat = ()=> useContext(ChatContext);