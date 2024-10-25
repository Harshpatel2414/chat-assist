import React, { useState, useEffect } from 'react';
import ChatCard from './ChatCard';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';
import { Divider, Flex } from 'antd';

const Chats = ({ onSelectChat }) => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useAuth();
    const { setChatData } = useChat();
    const router = useRouter();

    useEffect(() => {
        if (currentUser?.uid) {
            const unsubscribe = onSnapshot(doc(db, "UserChats", currentUser.uid), (doc) => {
                if (doc.exists()) {
                    const sortedChats = Object.entries(doc.data()).sort(
                        (a, b) => b[1].date - a[1].date
                    );
                    setChats(sortedChats);
                }
            });
            return () => unsubscribe();
        }
    }, [currentUser?.uid]);

    const handleSelect = (data, chatId) => {
        router.push(`/chat/${chatId}`);
        onSelectChat(data);
        setChatData({
            chatId: chatId,
            user: data,
        });
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                router.push('/chat');
            }
        };

        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    return (
        <Flex
            vertical 
            className="flex-1 hide-scrollbar dark:bg-transparent overflow-y-auto h-full w-full"
        >
            <Divider orientation='left' plain orientationMargin={16} className="text-white dark:text-gray-600">
                Recent chats
            </Divider>
            <Flex vertical gap={2}>
                {chats.map((chat) => (
                    <Flex
                        key={chat[0]}
                        onClick={() => handleSelect(chat[1].user, chat[0])}
                    >
                        <ChatCard chat={chat[1]} />
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
};

export default Chats;
