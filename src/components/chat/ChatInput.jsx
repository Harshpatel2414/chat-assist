'use client';

import React, { useState } from 'react';
import { Input, Button, Flex, Image, Upload, Progress } from 'antd';
import { SmileOutlined, SendOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { storage } from '@/firebase/firebaseConfig';
import emojiData from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useTheme } from '@/context/ThemeContext';
import ChatService from '@/firebase/chat';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false); // Emoji picker toggle
  const { currentUser } = useAuth();
  const { chatData } = useChat();
  const { theme} = useTheme();

  const handleSend = async () => {
    if (selectedImage) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, image);

      setIsUploading(true);
      setUploadProgress(0);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await ChatService.sendMessage(chatData.chatId,{
            text: caption,
            img: downloadURL,
            senderId: currentUser.uid,
          })
          setIsUploading(false);
          setSelectedImage(null);
          setImage(null);
          setMessage('');
        }
      );
    } else {
      await ChatService.sendMessage(chatData.chatId,{
        text: message,
        senderId: currentUser.uid,
      })
      setMessage('');
    }
  };

  const handleImageChange = (info) => {
    const file = info.file;
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setImage(file);
    }
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji.native);
  };

  return (
    <div className="drop-shadow-lg sticky bottom-0 flex items-center h-16 w-full px-4 bg-white dark:bg-gray-800">
      {selectedImage && (
        <div className="absolute mx-auto md:mx-4 right-0 left-0 bottom-[72px] z-40 w-full max-w-96 max-h-96 md:w-96 p-2 bg-white shadow-lg rounded-md dark:bg-gray-700">
          <Image
            src={selectedImage}
            alt="Selected"
            width={'100%'}
            height={'100%'}
            preview={false}
            loading={isUploading}
            className="object-contain object-center rounded-t-md w-full min-h-80 max-h-80 bg-gray-200 dark:bg-gray-600"
          />
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
            onClick={() => setSelectedImage(null)}
            className="absolute top-1 right-1 text-blue-600 bg-white dark:bg-gray-700 dark:text-gray-50"
          />
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
              <Progress type="circle" size={40} percent={uploadProgress} />
            </div>
          )}
        </div>
      )}

      <Flex align="center" className="w-full gap-2">
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={() => false}
          onChange={handleImageChange}
        >
          <Button className="dark:bg-gray-700 dark:text-gray-50 text-blue-500 border-none" icon={<LinkOutlined />} />
        </Upload>

        <Button
          icon={isEmojiPickerOpen ? <CloseOutlined /> : <SmileOutlined />}
          className="text-blue-500 dark:bg-gray-700 dark:text-gray-50 border-none"
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
        />

        {isEmojiPickerOpen && (
          <div className="absolute bottom-20 left-5 z-50">
            <Picker onEmojiSelect={handleEmojiSelect} theme={theme} />
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
