"use client";

import React from "react";
import { Layout } from "antd";
import Sidebar from "@/components/sidebar/Sidebar";
import { useChatLayout } from "@/context/ChatLayoutContext";

const { Sider, Content } = Layout;

export default function ChatLayout({ children }) {
  const { isSidebarVisible, isMobileView, toggleSidebar } = useChatLayout();

  return (
    <Layout className="h-dvh w-full">
      {/* Sidebar */}
      <Sider
        width={isMobileView ? "100%" : 320}
        collapsedWidth={0}
        collapsed={!isSidebarVisible}
        className={`transition-all duration-300  ${
          isMobileView ? "absolute h-full w-full z-20" : "w-1/4"
        }`}
      >
        <Sidebar onSelectChat={toggleSidebar} />
      </Sider>

      {/* Main Content */}
      <Content
        className={`flex-1 flex flex-col w-full transition-all duration-300 ${
          isMobileView && isSidebarVisible ? "" : "block"
        }`}
      >
        {children}
      </Content>
    </Layout>
  );
}
