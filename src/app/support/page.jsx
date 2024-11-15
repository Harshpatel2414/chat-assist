"use client";

import { useState } from 'react';
import { Button, Flex } from 'antd';
import { CloseOutlined, CommentOutlined, CustomerServiceOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons';
import Assistant from '@/components/assistant/Assistant';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const ChatAssistant = () => {
    const [isChatOpen, setChatOpen] = useState(false);
    const { logOut, currentUser } = useAuth();
    const { theme, toggleTheme } = useTheme();

    return (
        <div className='bg-blue-50 dark:bg-gray-950 h-[1200px] w-full hide-scrollbar relative'>
            <Flex align='center' justify='space-between' gap={16} className='bg-blue-500 dark:bg-gray-800 px-5 w-full h-16 sticky top-0'>
                <Flex align='center' className='gap-2'>
                    <h1 className='text-gray-200 dark:text-blue-500 capitalize'>Hii, {currentUser.displayName}</h1>
                    <Button size='small' onClick={logOut}>Logout</Button>
                </Flex>
                    <Button
                        type="text"
                        onClick={toggleTheme}
                        icon={
                            theme === "light" ? (
                                <MoonOutlined className="text-white hover:text-blue-500" />
                            ) : (
                                <SunOutlined className="text-white hover:text-blue-500" />
                            )
                        }
                        className="text-white hover:text-blue-600 transition-all duration-300"
                    />
            </Flex>
            <div className='fixed bottom-8 right-8'>
                <Button
                    type='text'
                    size='large'
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
                    onClick={() => setChatOpen(!isChatOpen)}
                    icon={isChatOpen ? <CloseOutlined className="text-2xl" /> : <CommentOutlined className="text-2xl" />}
                />

                {/* Chat Pop-up Modal */}
                {isChatOpen && (<Assistant />)}
            </div>
        </div>
    );
};

export default ChatAssistant;
