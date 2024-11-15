'use client'

// LayoutContext.js
import React, { createContext, useState, useRef, useEffect, useContext } from "react";

const ChatLayoutContext = createContext();

export const ChatLayoutProvider = ({ children }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isMobileView, setIsMobileView] = useState(true);

  const isMobileViewRef = useRef(isMobileView);
  const isSidebarVisibleRef = useRef(isSidebarVisible);

  const toggleSidebar = () => {
    if (isMobileViewRef.current) {
      const newSidebarState = !isSidebarVisibleRef.current;
      setIsSidebarVisible(newSidebarState);
      isSidebarVisibleRef.current = newSidebarState;
    }
  };

  const handleResize = () => {
    const currentWidth = window.innerWidth;
    const isMobile = currentWidth < 768;

    if (isMobile !== isMobileViewRef.current) {
      setIsMobileView(isMobile);
      isMobileViewRef.current = isMobile;

      if (isMobile) {
        // Show the sidebar by default when switching to mobile view
        setIsSidebarVisible(true);
        isSidebarVisibleRef.current = true;
      } else {
        // Keep sidebar visible on larger screens
        setIsSidebarVisible(true);
        isSidebarVisibleRef.current = true;
      }
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ChatLayoutContext.Provider
      value={{
        isSidebarVisible,
        isMobileView,
        toggleSidebar,
      }}
    >
      {children}
    </ChatLayoutContext.Provider>
  );
};

export const useChatLayout = () => useContext(ChatLayoutContext);
