"use client";
import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown, Button, Flex, Tag } from 'antd';
import { 
  ClearOutlined, 
  DeleteOutlined, 
  LeftOutlined, 
  MoreOutlined, 
  PhoneOutlined, 
  StopOutlined, 
  TagsOutlined, 
  UserOutlined, 
  VideoCameraOutlined 
} from '@ant-design/icons';
import { useChat } from '@/context/ChatContext';
import TagModal from './TagModal';

const ChatHeader = ({ onCloseChat, showProfile }) => {
  const { chatData } = useChat();
  const [tags, setTags] = useState(chatData?.tags || []);
  const [showTagModal, setShowTagModal] = useState(false);

  useEffect(()=>{
     if(chatData?.tags){
      setTags(chatData.tags)
     }
  },[chatData])

  // Menu items for the dropdown
  const menuItems = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: showProfile,
    },
    {
      key: '2',
      label: 'Add Tag',
      icon: <TagsOutlined />,
      onClick:  () => setShowTagModal(true),
    },
    {
      key: '3',
      label: 'Block',
      icon: <StopOutlined />,
    },
    {
      key: '4',
      label: 'Clear chat',
      icon: <ClearOutlined />,
    },
    {
      key: '5',
      label: 'Delete chat',
      danger: true,
      icon: <DeleteOutlined />,
    },
  ];

  return (
    <Flex
      align="center"
      justify="between"
      className="h-16 w-full p-4 bg-blue-800 dark:bg-gray-800 text-white drop-shadow-md"
    >
      {/* User Info */}
      <Flex align="center" className="flex-1 w-3/4 md:w-full gap-2">
        <Button
          size="small"
          type="text"
          className="md:hidden text-gray-200"
          icon={<LeftOutlined />}
          onClick={onCloseChat}
        />
        <Avatar src={chatData?.user.photoURL} size={40} className='bg-blue-200 mr-1'/>
        <Flex vertical className="flex-1 gap-1 min-w-0">
          <span className="text-base font-semibold tracking-wide truncate capitalize" title={chatData?.user.displayName}>
            {chatData?.user.displayName}
          </span>
          <div className="flex gap-1">
              {tags?.length > 0 && tags.map((tag, idx) => (
                <Tag  key={idx}  className='bg-blue-50 dark:bg-blue-700 dark:text-gray-300 border-none capitalize'>{tag}</Tag>
              ))}
            </div>
        </Flex>
      </Flex>

      {/* Action Icons */}
      <Flex align="center" justify='end' className="w-1/4 md:w-fit gap-2">
        <Button
          type="text"
          icon={<VideoCameraOutlined />}
          className="text-white"
          title="Video Call"
        />
        <Button
          type="text"
          icon={<PhoneOutlined />}
          className="text-white"
          title="Voice Call"
        />
        <Dropdown
        className='w-80'
          menu={{
            items: menuItems,
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined className='hover:text-blue-200 text-white font-bold'/>} />
        </Dropdown>
      </Flex>
      <TagModal 
        chatId={chatData?.chatId} 
        visible={showTagModal} 
        onClose={() => setShowTagModal(false)} 
        tags={tags} 
        setTags={setTags} 
      />
    </Flex>
  );
};

export default ChatHeader;
