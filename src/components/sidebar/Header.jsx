import React, { useState } from "react";
import { Avatar, Dropdown, Button, Flex } from "antd";
import {
  MoreOutlined,
  SunOutlined,
  MoonOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { theme, toggleTheme } = useTheme();
  const { logOut, currentUser } = useAuth();

  // Menu items
  const menu = [
    {
      key: 1,
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: 2,
      label: "Setting",
      icon: <SettingOutlined />,
    },
    {
      key: 3,
      label: "Logout",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: logOut,
    },
  ];

  return (
    <Flex
      horizontal
      align="center"
      justify="space-between"
      className="h-16 p-4 bg-blue-800 dark:bg-gray-800 text-white"
    >
      {/* User Profile Section */}
      <Flex horizontal align="center">
        <Avatar src={currentUser?.photoURL} size={40} />
        <Flex vertical className="ml-2">
          <div className="text-lg font-bold">{currentUser?.displayName}</div>
        </Flex>
      </Flex>

      {/* Icon Section */}
      <Flex horizontal align="center">
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

        {/* Profile Menu */}
        <Dropdown menu={{ items: menu }} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined className="text-white hover:text-blue-500" />}
            className="text-white"
          />
        </Dropdown>
      </Flex>
    </Flex>
  );
};

export default Header;
