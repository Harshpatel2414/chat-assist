"use client"; // Ensure this file is treated as a client-side component in Next.js

import { useEffect, useRef, useState } from "react";
import { Avatar, Typography, Flex, Spin } from "antd";
import { CustomerServiceOutlined } from "@ant-design/icons";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import AssistantInput from "./AssistantInput";
import AssistantMessage from "./AssistantMessage";
import { db } from "@/firebase/firebaseConfig";

const Assistant = () => {
  const [messages, setMessages] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const defaultMessage = {
    senderId: "bot",
    text: "I'm happy to chat and answer any questions. To better assist you, have you used our software before, or is this your first time?",
    date: Date.now(),
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const scrollTimeout = setTimeout(() => {
        scrollToBottom();
      }, 100);

      return () => clearTimeout(scrollTimeout);
    }
  }, [messages]);

  // Reference to the user's chat document and the messages subcollection
  const chatDocRef = doc(db, "Chats", currentUser?.uid);
  const messagesCollectionRef = collection(chatDocRef, "messages");

  useEffect(() => {
    if (!currentUser && isFetched) return;

    const messagesQuery = query(messagesCollectionRef, orderBy("date", "asc"));
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);

      setIsLoading(false);
      setIsFetched(true);
    });

    return () => unsubscribe();
  }, [currentUser, isFetched]);

  return (
    <Flex
      vertical
      className="fixed bottom-20 right-8 w-[360px] md:w-[400px] h-[500px] overflow-hidden drop-shadow-md rounded-lg"
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        className="p-3 drop-shadow-md bg-blue-500 dark:bg-gray-700 text-white rounded-t-lg"
      >
        <Flex align="center">
          <Avatar
            size="small"
            icon={<CustomerServiceOutlined />}
            className="mr-2 bg-blue-700"
          />
          <Typography.Text className="font-semibold text-white">
            LiveChat Assistant
          </Typography.Text>
        </Flex>
      </Flex>

      {/* Messages List */}
      <Flex
        vertical
        className="p-4 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-800 hide-scrollbar"
      >
        {isLoading ? (
          <Flex justify="center" align="center" className="h-full">
            <Spin size="small" tip="Loading messages..." />
          </Flex>
        ) : messages.length > 0 ? (
          messages.map((msg, index) => (
            <AssistantMessage
              key={index} // Use the index to uniquely identify each message
              message={msg}
              isLastMessage={index === messages.length - 1}
            />
          ))
        ) : (<AssistantMessage
          key={1}
          message={defaultMessage}
          isLastMessage={true}
        />)}
        <div ref={messagesEndRef} />
      </Flex>

      {/* Input Area */}
      <AssistantInput />
    </Flex>
  );
};

export default Assistant;
