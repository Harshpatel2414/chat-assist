"use client";

import React, { useEffect, useState } from 'react';
import { Typography, Image } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { Timestamp } from 'firebase/firestore'; // Import Firebase Timestamp if necessary

const Message = ({ message, isLastMessage }) => {
  const [formattedTime, setFormattedTime] = useState('');
  const { currentUser } = useAuth();
  const { text, date, senderId, img } = message;

  const formatTime = (firebaseTimestamp) => {
    const messageDate = firebaseTimestamp instanceof Timestamp 
      ? firebaseTimestamp.toDate() 
      : new Date(firebaseTimestamp);

    const now = new Date();
    const differenceInSeconds = Math.floor((now - messageDate) / 1000);

    // Only show "Just now" for the last message if sent within 30 seconds
    if (isLastMessage && differenceInSeconds < 30) {
      return 'Just now';
    }

    // Format the time as "HH:MM AM/PM"
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  useEffect(() => {
    setFormattedTime(formatTime(date));

    const intervalId = setInterval(() => {
      setFormattedTime(formatTime(date));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [date, isLastMessage]);

  return (
    <div className={`flex flex-col p-2 rounded-lg  ${currentUser.uid === senderId ? 'items-end' : 'items-start'}`}>
      <div className={`flex flex-col drop-shadow-md p-2 rounded-lg w-fit max-w-[80%]  ${currentUser.uid === senderId ? 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-tr-none' : 'bg-blue-500 dark:bg-blue-800 text-gray-100 rounded-tl-none'}`}>
        {img && <Image src={img} alt={img} height={160} width={200} preview={false} className='rounded-md' content='contain'/>}
        <Typography.Text className={`text-base text-justify ${currentUser.uid === senderId ? 'text-right text-gray-600 dark:text-gray-300' : 'text-left text-gray-100'}`}>
          {text}
        </Typography.Text>
      </div>

      <Typography.Text className={`text-xs text-gray-500 block mt-1 ${currentUser.uid === senderId ? 'text-right' : 'text-left'}`}>
        {formattedTime}
      </Typography.Text>
    </div>
  );
};

export default Message;
