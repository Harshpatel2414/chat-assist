"use client";

import { useState } from 'react';
import { Input, Avatar, Typography, Button } from 'antd';
import { CustomerServiceOutlined, SendOutlined, CloseOutlined, CommentOutlined } from '@ant-design/icons';
import Assistant from '@/components/assistant/Assistant';

const ChatAssistant = () => {
    const [isChatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            text: "I'm happy to chat and answer any questions. To better assist you, have you used our software before, or is this your first time?",
        },
    ]);

    const handleUserResponse = (response) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'user', text: response },
        ]);

        // Simulate bot response
        setTimeout(() => {
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'bot', text: "Since you're new to LiveChat, let's get you started. What would you like to do?" },
                { type: 'options', options: ["Sign up free 🚀", "Contact Sales", "Ask me a question"] },
            ]);
        }, 1000);
    };

    return (
        <div className='bg-blue-50 h-[1200px] w-full hide-scrollbar'>
            <div className='fixed bottom-8 right-8'>
                <Button
                    type='text'
                    size='large'
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
                    onClick={() => setChatOpen(!isChatOpen)}
                    icon={isChatOpen ? <CloseOutlined className="text-2xl" /> : <CommentOutlined className="text-2xl" />}
                >

                </Button>
                {/* {isChatOpen && (
                    <div className="absolute bottom-16 right-0 w-[360px] h-[500px] bg-white border border-gray-300 shadow-lg rounded-lg flex flex-col transition-all duration-1000">
                        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-blue-500 text-white rounded-t-lg">
                            <div className="flex items-center">
                                <Avatar size="small" icon={<CommentOutlined />} className="mr-2 bg-blue-700" />
                                <span className="font-semibold">LiveChat Bot</span>
                            </div>
                            <button onClick={() => setChatOpen(false)} className="text-white hover:text-gray-300">
                                <CloseOutlined />
                            </button>
                        </div>
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

                            {messages[messages.length - 1]?.type === 'options' && (
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    {messages[messages.length - 1].options.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleUserResponse(option)}
                                            className="px-3 py-1 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-1 items-center pl-4 py-2 border-t border-gray-200">
                            <Input
                                placeholder="Write a message..."
                                className="flex-1 rounded-lg border-gray-300"
                                onPressEnter={(e) => handleUserResponse(e.target.value)}
                            />
                            <button
                                className="text-blue-600 p-2 rounded-lg hover:text-blue-400"
                                onClick={() => handleUserResponse("Message text")}
                            >
                                <SendOutlined className='text-xl' />
                            </button>
                        </div>
                    </div>
                )} */}
                {isChatOpen && (<Assistant/>)}

                {/* Chat Pop-up Modal */}
            </div>
        </div>
    );
};

export default ChatAssistant;
