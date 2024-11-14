"use client"
import { db } from "@/firebase/firebaseConfig";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react"

export const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {
    const [chatData, setChatData] = useState(null)
    const [messages,setMessages] = useState([])
    const router = useRouter()
    
    useEffect(()=>{
        if(!chatData){
            // router.push('/chat')
        }
    },[])

    useEffect(() => {
        if (chatData?.chatId) {
            const messagesRef = query(collection(doc(db, 'Chats', chatData.chatId), 'messages'), orderBy("date", "asc"));
            const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
                const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
              setMessages(data);
            });
            return unsubscribe;
          }
      }, [chatData?.chatId]);

    return (
        <ChatContext.Provider value={{ chatData,setChatData ,messages}}>
            {children}
        </ChatContext.Provider >
    )
};

export const useChat = ()=> useContext(ChatContext);