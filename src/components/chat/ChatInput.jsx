"use client";

import React, { useState } from "react";
import { Input, Button, Flex, Image, Upload, Progress, Dropdown } from "antd";
import {
  SmileOutlined,
  SendOutlined,
  CloseOutlined,
  LinkOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import Picker from "@emoji-mart/react";
import data from '@emoji-mart/data'
import { useTheme } from "@/context/ThemeContext";
import ChatService from "@/firebase/chat";

const ChatInput = () => {
  const [message, setMessage] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // Generalized file state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false); // Emoji picker toggle
  const { currentUser } = useAuth();
  const { chatData } = useChat();
  const { theme } = useTheme();

  // Handle any file change (image, video, document)
  const handleFileChange = (info) => {
    const file = info.file;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setSelectedFile({
        fileUrl,
        file,
        type: file.type,
      });
    }
  };

  const handleSend = async () => {
    if (selectedFile) {
      try {
        setIsUploading(true);
        setUploadProgress(0);

        const downloadURL = await ChatService.uploadMedia(
          selectedFile.file,
          (progress) => setUploadProgress(progress)
        );
        setSelectedFile(null);
        setIsUploading(false);

        if (selectedFile.type.startsWith("image")) {
          await ChatService.sendMessage(chatData.chatId, {
            text: caption,
            img: downloadURL,
            senderId: currentUser.uid,
          });
        } else if (selectedFile.type.startsWith("video")) {
          await ChatService.sendMessage(chatData.chatId, {
            text: caption,
            video: downloadURL,
            senderId: currentUser.uid,
          });
        }
        setCaption("");
        setMessage("");
      } catch (error) {
        console.error("Failed to upload or send the file:", error);
        setIsUploading(false);
      }
    } else {
      if (message.trim().length < 1) {
        return;
      }
      await ChatService.sendMessage(chatData.chatId, {
        text: message,
        senderId: currentUser.uid,
      });
      setMessage("");
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  // Menu items for Upload components
  const items = [
    {
      key: "1",
      label: (
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleFileChange}
        >
          <Button
            className=" dark:text-gray-700 text-blue-500 border-none"
            icon={<FileImageOutlined />}
          >
            Images
          </Button>
        </Upload>
      ),
    },
    {
      key: "2",
      label: (
        <Upload
          accept="video/*"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleFileChange}
          className="w-full"
        >
          <Button
            className=" dark:text-gray-700 text-blue-500 border-none"
            icon={<VideoCameraOutlined />}
          >
            Videos
          </Button>
        </Upload>
      ),
    },
  ];

  return (
    <div className="drop-shadow-lg sticky bottom-0 flex items-center h-16 w-full px-4 bg-white dark:bg-gray-800">
      {selectedFile && (
        <div className="absolute mx-auto md:mx-4 right-0 left-0 bottom-[72px] z-40 w-full max-w-96 min-h-40 md:w-96 p-2 bg-white shadow-lg rounded-md dark:bg-gray-700">
          {selectedFile.type.startsWith("image") && (
            <Image
              src={selectedFile.fileUrl}
              alt="Selected"
              width={"100%"}
              height={"100%"}
              preview={false}
              loading={isUploading}
              className="object-contain object-center rounded-t-md w-full min-h-80 max-h-80 bg-gray-200 dark:bg-gray-600"
            />
          )}
          {selectedFile.type.startsWith("video") && (
            <video
              controls
              width="200px"
              className="object-center object-contain rounded-t-md w-full h-fit max-h-80 max-h-80 bg-gray-200 dark:bg-gray-600 mb-2"
              src={selectedFile.fileUrl}
            />
          )}
          <div className="flex items-center w-full bg-gray-50 dark:bg-gray-600 rounded-b-lg">
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              onPressEnter={handleSend}
              type="text"
              placeholder="write a caption..."
              className="flex-1 placeholder:text-gray-500 dark:text-gray-300 dark:focus:text-gray-300 w-full focus:border-none bg-transparent focus:outline-none focus:bg-transparent hover:bg-transparent outline-none border-none dark:placeholder:text-gray-400"
            />
            <Button
              type="text"
              icon={<SendOutlined />}
              onClick={handleSend}
              className="text-blue-500 hover:text-blue-400"
            />
          </div>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setSelectedFile(null)}
            className="absolute top-1 right-1 text-blue-600 bg-white dark:bg-gray-700 dark:text-gray-50"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-black bg-opacity-50 dark:bg-opacity-70 rounded-md">
              <Progress type="circle" size={40} percent={uploadProgress} className="text-gray-50" />
            </div>
          )}
        </div>
      )}

      <Flex align="center" className="w-full gap-2">
        <Dropdown
          menu={{ items }}
          className="text-blue-500 dark:bg-gray-500 dark:text-gray-50 hover:bg-gray-800 border-none"
          placement="topLeft"
        >
          <Button
            className="dark:bg-gray-700 dark:text-gray-50 text-blue-500 border-none"
            icon={<LinkOutlined />}
          />
        </Dropdown>

        <Button
          icon={isEmojiPickerOpen ? <CloseOutlined /> : <SmileOutlined />}
          className="text-blue-500 dark:bg-gray-700 dark:text-gray-50 border-none"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
        />

        {isEmojiPickerOpen && (
          <div className="absolute bottom-20 left-5 z-50">
            <Picker
              previewPosition='none'
              searchPosition='none'
              data={data}
              theme={theme}
              onEmojiSelect={handleEmojiSelect}
            />
          </div>
        )}

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Type a message..."
          className="flex-1 focus:border-none dark:text-gray-300 dark:focus:text-gray-300 bg-transparent hover:bg-transparent outline-none border-none dark:placeholder:text-gray-400 focus:bg-transparent"
        />

        <Button
          type="text"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={message.length < 1}
          className="text-blue-500 hover:text-blue-400"
        />
      </Flex>
    </div>
  );
};

export default ChatInput;
