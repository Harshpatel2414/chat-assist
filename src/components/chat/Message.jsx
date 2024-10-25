"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Flex } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { Timestamp } from 'firebase/firestore';

const Message = ({ message, isLastMessage }) => {
  const [formattedTime, setFormattedTime] = useState('');
  const { currentUser } = useAuth();
  const { text, date, senderId } = message;

  // Function to format the timestamp
  const formatTime = (firebaseTimestamp) => {
    const messageDate = firebaseTimestamp instanceof Timestamp
      ? firebaseTimestamp.toDate()
      : new Date(firebaseTimestamp);

    const now = new Date();
    const differenceInSeconds = Math.floor((now - messageDate) / 1000);

    // Show "Just now" for recent messages if sent within 30 seconds
    if (isLastMessage && differenceInSeconds < 30) {
      return 'Just now';
    }

    // Return formatted time in "HH:MM AM/PM" format
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Update the formatted time when the date or message status changes
  useEffect(() => {
    setFormattedTime(formatTime(date));

    const intervalId = setInterval(() => {
      setFormattedTime(formatTime(date));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [date, isLastMessage]);

  // Determine if the message is sent by the current user
  const isCurrentUser = currentUser.uid === senderId;

  return (
    <Flex
      vertical
      className={`p-2 rounded-lg ${isCurrentUser ? 'items-end' : 'items-start'}`}
    >
      <Flex
        vertical
        className={`drop-shadow-md p-2 rounded-lg max-w-[80%] w-fit 
          ${isCurrentUser 
            ? 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-tr-none'
            : 'bg-blue-500 dark:bg-blue-800 text-gray-100 rounded-tl-none'
          }`}
      >
        <Typography.Text className={`text-base ${isCurrentUser ? 'text-right text-gray-600 dark:text-gray-300' : 'text-left text-gray-100'}`}>
          {text}
        </Typography.Text>
      </Flex>
      <Typography.Text className={`text-xs text-gray-500 block mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
        {formattedTime}
      </Typography.Text>
    </Flex>
  );
};

export default Message;
