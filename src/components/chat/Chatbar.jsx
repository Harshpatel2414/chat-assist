"use client";
import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown, Button, Flex } from 'antd';
import { 
  ClearOutlined, 
  DeleteOutlined, 
  LeftOutlined, 
  MoreOutlined, 
  PhoneOutlined, 
  StopOutlined, 
  UserOutlined, 
  VideoCameraOutlined 
} from '@ant-design/icons';
import { useChat } from '@/context/ChatContext';
import { db as firestoreDb } from '@/firebase/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import dayjs from 'dayjs';

const ChatHeader = ({ onCloseChat, showProfile }) => {
  const { chatData } = useChat();
  const [userStatus, setUserStatus] = useState({ online: false, lastSeen: null });

  // Fetch user's online status from Firestore
  useEffect(() => {
    if (chatData?.user?.uid) {
      const userRef = doc(firestoreDb, 'Users', chatData.user.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const statusData = doc.data();
          setUserStatus({
            online: statusData.online,
            lastSeen: statusData.lastSeen?.toDate() || null,
          });
        }
      });

      // Cleanup on unmount
      return () => unsubscribe();
    }
  }, [chatData?.user?.uid]);

  // Format the last seen time
  const formatLastSeen = (lastSeen) => {
    // if (!lastSeen) return 'offline';
    return `last seen ${dayjs(lastSeen).format('MMMM D, YYYY [at] h:mm A')}`;
  };

  // Menu items for the dropdown
  const menuItems = [
    {
      key: '2',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: showProfile,
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
      className="h-16 w-full p-4 bg-blue-800 dark:bg-gray-800 text-white"
    >
      {/* User Info */}
      <Flex align="center" className="flex-1 w-3/4 md:w-full gap-2">
        <Button
          size="small"
          type="text"
          className="md:hidden text-gray-400"
          icon={<LeftOutlined />}
          onClick={onCloseChat}
        />
        <Avatar src={chatData?.user.photoURL} size={40} className='bg-blue-200'/>
        <Flex vertical className="flex-1 min-w-0">
          <span className="text-base font-semibold tracking-wide truncate capitalize" title={chatData?.user.displayName}>
            {chatData?.user.displayName}
          </span>
          <span className={`${userStatus.online ? 'text-green-300': ''} text-xs text-gray-400`}>
            {userStatus.online ? 'online' : userStatus.lastSeen ? formatLastSeen(userStatus?.lastSeen): 'offline'}
          </span>
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
          menu={{
            items: menuItems,
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined className='hover:text-blue-200 text-white font-bold'/>} />
        </Dropdown>
      </Flex>
    </Flex>
  );
};

export default ChatHeader;
