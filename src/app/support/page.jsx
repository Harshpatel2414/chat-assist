"use client";

import { useState } from 'react';
import { Button } from 'antd';
import {  CloseOutlined, CommentOutlined } from '@ant-design/icons';
import Assistant from '@/components/assistant/Assistant';

const ChatAssistant = () => {
    const [isChatOpen, setChatOpen] = useState(false);

    return (
        <div className='bg-blue-50 h-[1200px] w-full hide-scrollbar'>
            <div className='fixed bottom-8 right-8'>
                <Button
                    type='text'
                    size='large'
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
                    onClick={() => setChatOpen(!isChatOpen)}
                    icon={isChatOpen ? <CloseOutlined className="text-2xl" /> : <CommentOutlined className="text-2xl" />}
                />
    
                {/* Chat Pop-up Modal */}
                {isChatOpen && (<Assistant/>)}
            </div>
        </div>
    );
};

export default ChatAssistant;
