import { Layout } from 'antd'
import React, { useState } from 'react'
import Chatbar from './Chatbar';
import Messages from './Messages';
import ChatInput from './ChatInput';
import Profile from './Profile';
import { useChatLayout } from '@/context/ChatLayoutContext';

const { Sider, Content } = Layout;

const ChatContainer = () => {
  const {isMobileView, toggleSidebar} = useChatLayout()
  const [isProfileVisible, setIsProfileVisible] = useState(false)
  
  return (
    <Layout>
      <Content
      className={`${isProfileVisible? '' : 'block'}`}
      >
        <div className={` flex-1 flex flex-col h-full w-full`}>
          <Chatbar onCloseChat={toggleSidebar} showProfile={() => setIsProfileVisible(true)}/>
          <Messages />
          <ChatInput />
        </div>
      </Content>
      <Sider
        collapsedWidth={0}
        collapsed={!isProfileVisible}
        className={`w-full md:w-80 absolute right-0 top-0 md:relative h-full transition-all duration-300 `}
        width={isMobileView ? '100%' : '320'}
      >
        <Profile toggleProfile={() => setIsProfileVisible(false)} />
      </Sider>
    </Layout>
  )
}

export default ChatContainer