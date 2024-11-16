import React, { useState, useEffect } from 'react';
import ChatCard from './ChatCard';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { Divider, Flex } from 'antd';
import ChatService from '@/firebase/chat';
import { useChatLayout } from '@/context/ChatLayoutContext';

const Chats = ({ onSelectChat }) => {
    const [chats, setChats] = useState([]);
    const { currentUser } = useAuth();
    const { setChatData } = useChat();
    const { toggleSidebar} = useChatLayout()
    
    useEffect(() => {
        if (currentUser?.uid) {
            const unsubscribe = ChatService.getChats((data) => {
                setChats(data);
            });
            return () => {
                unsubscribe();
            };
        }
    }, [currentUser?.uid]);

    const handleSelect = (data) => {
        onSelectChat(data);
        setChatData({chatId: data.id , ...data});
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                toggleSidebar(true)
                setChatData(null)
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
                        key={chat.id}
                        onClick={() => handleSelect(chat)}
                    >
                        <ChatCard chat={chat}/>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    );
};

export default Chats;
