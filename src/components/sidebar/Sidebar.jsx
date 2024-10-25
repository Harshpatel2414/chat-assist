import React from 'react';
import { Flex, Space } from 'antd';
import Header from './Header';
import Searchbar from './Searchbar';
import Chats from './Chats';

const Sidebar = ({ onSelectChat }) => {
  return (
    <Flex
      vertical
      className='h-full w-full bg-white md:border-r-2 dark:bg-transparent md:dark:border-r-gray-600 drop-shadow-lg shadow-zinc-800'
    >
      <Header />
      <Searchbar />
      <Chats onSelectChat={onSelectChat} />
    </Flex>
  );
};

export default Sidebar;
