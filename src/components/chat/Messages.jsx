"use client";
import React, { useEffect, useRef, useContext, useState } from 'react';
import { List, Spin, Typography, Flex } from 'antd';
import Message from './Message';
import { useChat } from '@/context/ChatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import MessageWithMedia from './MessageWithMedia';
import { useRouter } from 'next/navigation';

const { Text } = Typography;

const Messages = () => {
  const messagesEndRef = useRef(null);
  // const [messages, setMessages] = useState(null);
  const { messages } = useChat()
  const router = useRouter()
  // Fetch real-time messages
  // useEffect(() => {
  //   if (!chatData) {
  //     router.push('/chat')
  //   } else {
  //     const unSub = onSnapshot(doc(db, 'Chats', chatData.chatId), (doc) => {
  //       if (doc.exists()) {
  //         setMessages(doc.data().messages);
  //       } else {
  //         setMessages([]);
  //       }
  //     });

  //     return () => unSub();
  //   }
  // }, [chatData?.chatId]);

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll when messages change
  useEffect(() => {
    if (messages && messages.length > 0) {
      const scrollTimeout = setTimeout(() => {
        scrollToBottom();
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto hide-scrollbar scroll-smooth h-full p-4 bg-gray-50 dark:bg-gray-900">
      {!messages ? (
        <Flex align="center" justify="center" className="w-full h-full">
          <Spin size="large" />
        </Flex>
      ) : messages.length === 0 ? (
        <Flex align="center" justify="center" className="w-full h-full">
          <Text type="secondary" className='dark:text-gray-50 text-blue-500'>Start chat by sending a message.</Text>
        </Flex>
      ) : (
        <List
          className='w-full '
          dataSource={messages}
          renderItem={(msg, index) => {
            if (msg.img) {
              return <MessageWithMedia key={msg.id} message={msg} isLastMessage={index === messages.length - 1} />
            }
            else {
              return <Message key={msg.id} message={msg} isLastMessage={index === messages.length - 1} />
            }
          }}
        />
      )}
      {/* Dummy div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
