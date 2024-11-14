"use client"
import React from 'react'
import { Flex, Image, Typography } from 'antd'
import { useChat } from '@/context/ChatContext'
import ChatContainer from '@/components/chat/ChatContainer'
const { Text, Paragraph} = Typography
const page = () => {

  const { chatData} = useChat()

  return  chatData ? <ChatContainer/> : <Flex align='center' justify='center' className='flex flex-col gap-2 h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-800'>
        <Image preview={false} src='./logo_icon.png'  width={100}/>
        <Text className='dark:text-gray-50 text-blue-500 text-3xl font-semibold'>
          Assistance Chat
        </Text>
        <Paragraph  level={2} className='text-gray-500'>
            Start Chat with your friends 
        </Paragraph>
    </Flex>
  
}

export default page