"use client";
import React, { useEffect, useRef, useState } from "react";
import { List, Spin, Typography, Flex } from "antd";
import Message from "./Message";
import { useChat } from "@/context/ChatContext";
import MessageWithMedia from "./MessageWithMedia";
import ChatService from "@/firebase/chat";

const { Text } = Typography;

const Messages = () => {
  const messagesEndRef = useRef(null);
  const { messages, loading } = useChat();

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };
    if (Array.isArray(messages) && messages.length > 0) {
      const scrollTimeout = setTimeout(scrollToBottom, 100);
      return () => clearTimeout(scrollTimeout);
    }
  }, [messages]);

  return (
    <div className="overflow-y-auto hide-scrollbar scroll-smooth h-full p-4 bg-gray-50 dark:bg-gray-900">
      {loading ? (
        <Flex align="center" justify="center" className="w-full h-full">
          <Spin />
        </Flex>
      ) : messages.length === 0 ? (
        <Flex align="center" justify="center" className="w-full h-full">
          <Text type="secondary" className="dark:text-gray-50 text-blue-500">
            Start chat by sending a message.
          </Text>
        </Flex>
      ) : (
        <List
          className="w-full"
          dataSource={messages}
          renderItem={(msg, index) =>
            msg.img || msg.video ? (
              <MessageWithMedia
                key={msg.id}
                message={msg}
                isLastMessage={index === messages.length - 1}
              />
            ) : (
              <Message
                key={msg.id}
                message={msg}
                isLastMessage={index === messages.length - 1}
              />
            )
          }
        />
      )}
      {/* Dummy div to scroll to */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;
