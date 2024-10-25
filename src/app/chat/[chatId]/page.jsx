"use client"
import React from 'react'
import ChatContainer from '@/components/chat/ChatContainer'
import { Flex } from 'antd'

const page = () => {
    
    return (
        <Flex className='flex h-full w-full'>
           <ChatContainer/>
        </Flex>
    )
}

export default page