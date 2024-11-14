"use client";

import React from "react";
import { Avatar, Badge, Typography, Space, Flex } from "antd";

const { Text } = Typography;

const ChatCard = ({ chat }) => {
    const { user, lastMessage, date, messageRead } = chat;

    const formatDate = (timestamp) => {
        if (!timestamp) return ""; 

        const date = timestamp.toDate();
        const now = new Date();
        
        const timeDiff = Math.abs(now - date); 
        const diffDays = Math.floor(timeDiff / (1000 * 3600 * 24)); 

        if (diffDays === 0) {
            return convertTimeStamp(timestamp); 
        } else if (diffDays === 1) {
            return "Yesterday";
        } else {
            return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        }
    };

    const convertTimeStamp = (timestamp) => {
        if (!timestamp) return ""; 

        const date = timestamp.toDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const ampm = hour >= 12 ? 'pm' : 'am';

        return `${hour % 12 || 12}:${minute < 10 ? '0' + minute : minute} ${ampm}`;
    };

    return (
        <Flex
            className="p-4 h-16 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer  w-full select-none"
            align="center"
            justify="between"
        >
            <Flex align="center" className="flex gap-2 w-3/4">
                <Avatar src={user.photoURL} className="w-10 h-10 rounded-full overflow-hidden" />
                <Space direction="vertical" size={0} className="flex-1 overflow-hidden w-full">
                    <Text strong className="text-md text-gray-800 dark:text-blue-400 truncate w-full capitalize">
                        {user.displayName}
                    </Text>
                    <Text
                        className={`${messageRead ? 'font-medium' : ''} text-sm text-gray-600 dark:text-gray-200 truncate w-full`}
                    >
                        {lastMessage?.length > 20
                            ? `${lastMessage?.slice(0, 20)}...`
                            : lastMessage}
                    </Text>
                </Space>
            </Flex>
            <Flex vertical align="end" className="w-1/4 text-right">
                <Text className="text-xs text-gray-500 mb-1">
                    {formatDate(date)}
                </Text>
                {lastMessage?.unreadCount > 0 && ( // Show badge only if there are unread messages
                    <Badge
                        count={lastMessage.unreadCount}
                        status="success"
                        className="border-none"
                    />
                )}
            </Flex>
        </Flex>
    );
};

export default ChatCard;
