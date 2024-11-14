"use client"
import { Avatar } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import { useState } from 'react';

const AssistantMessages = () => {
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "I'm happy to chat and answer any questions. To better assist you, have you used our software before, or is this your first time?",
        },
    ]);
    return (
    <div className="p-4 flex-1 overflow-y-auto bg-gray-50 hide-scrollbar">
        {messages.map((msg, index) => (
            <div
                key={index}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} my-2`}
            >
                {msg.type === 'bot' && <Avatar size="small" icon={<CommentOutlined />} className="mr-2 bg-blue-500 " />}
                <div
                    className={`${msg.type === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-gray-200 text-gray-800 flex-1 rounded-tl-none'
                        } py-2 px-3 rounded-lg max-w-xs `}
                >
                    {msg.text}
                </div>
            </div>
        ))}
      
    </div>
    )
};

export default AssistantMessages;
