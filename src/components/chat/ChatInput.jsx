'use client';

import React, { useState, useContext } from 'react';
import { Input, Button, Flex, Image, Upload } from 'antd';
import { SmileOutlined, SendOutlined, CloseOutlined, LinkOutlined } from '@ant-design/icons';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'; // Firebase imports
import { v4 as uuid } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { ChatContext, useChat } from '@/context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase/firebaseConfig';

const ChatInput = () => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [image, setImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress
  const { currentUser } = useAuth();
  const { chatData } = useChat();

  const handleSend = async () => {
    if (selectedImage) {
      const storageRef = ref(storage, uuid()); // Generate unique ID for image
      const uploadTask = uploadBytesResumable(storageRef, image); // Start upload task

      setIsUploading(true);
      setUploadProgress(0); // Reset progress on new upload

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculate progress percentage
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress); // Update progress state
        },
        (error) => {
          console.error('Upload error:', error);
          setIsUploading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, 'Chats', chatData.chatId), {
            messages: arrayUnion({
              id: uuid(),
              text: message,
              senderId: currentUser.uid,
              date: Timestamp.now(),
              img: downloadURL,
            }),
          });
          setIsUploading(false);
          setSelectedImage(null);
          setImage(null);
          setMessage('');
          await updateDoc(doc(db, 'UserChats', currentUser.uid), {
            [chatData.chatId + '.lastMessage']: 'photo',
            [chatData.chatId + '.date']: serverTimestamp(),
            [chatData.chatId + '.messageRead']: true,
          });
          await updateDoc(doc(db, 'UserChats', chatData.user.uid), {
            [chatData.chatId + '.lastMessage']: 'photo',
            [chatData.chatId + '.date']: serverTimestamp(),
            [chatData.chatId + '.messageRead']: false,
          });
        }
      );
    } else {
      // Sending message without image
      await updateDoc(doc(db, 'Chats', chatData.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: message,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      setMessage('');
      await updateDoc(doc(db, 'UserChats', currentUser.uid), {
        [chatData.chatId + '.lastMessage']: message,
        [chatData.chatId + '.date']: serverTimestamp(),
        [chatData.chatId + '.messageRead']: true,
      });
      await updateDoc(doc(db, 'UserChats', chatData.user.uid), {
        [chatData.chatId + '.lastMessage']: message,
        [chatData.chatId + '.date']: serverTimestamp(),
        [chatData.chatId + '.messageRead']: false,
      });
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

  return (
    <div className="drop-shadow-lg relative flex items-center h-16 w-full px-4 bg-white dark:bg-gray-800">
      {/* Preview selected image with loader */}
      {selectedImage && (
        <div className="absolute mx-auto md:mx-4 right-0 left-0 bottom-[72px] z-40 w-full max-w-96 max-h-96 md:w-96 p-2 bg-white shadow-lg rounded-md dark:bg-gray-700">
          <Image
            src={selectedImage}
            alt="Selected"
            width={'100%'}
            height={'100%'}
            preview={false}
            loading={isUploading}
            className="object-cover object-center rounded-t-md w-full h-80 bg-gray-200 dark:bg-gray-600"
          />
          <div className="flex items-center w-full bg-gray-50 dark:bg-gray-600 rounded-b-lg">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onPressEnter={handleSend}
              type="text"
              placeholder="write a caption..."
              className="flex-1 placeholder:text-gray-500 w-full focus:border-none bg-transparent hover:bg-transparent outline-none border-none dark:placeholder:text-gray-400"
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
          {/* Progress Indicator */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
              <span className="text-white font-bold">{`${Math.round(uploadProgress)}%`}</span>
            </div>
          )}
          {/* Message sent indication */}
          {!isUploading && uploadProgress === 100 && (
            <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-30 rounded-md">
              <span className="text-white font-bold">Message Sent!</span>
            </div>
          )}
        </div>
      )}

      <Flex align="center" className="w-full gap-2">
        {/* Upload Button */}
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={() => false} // Prevent automatic upload
          onChange={handleImageChange}
        >
          <Button className="dark:bg-gray-700 dark:text-gray-50 text-blue-500 border-none" icon={<LinkOutlined />} />
        </Upload>

        {/* Emoji Button */}
        <Button icon={<SmileOutlined />} className="text-blue-500 dark:bg-gray-700 dark:text-gray-50 border-none" />

        {/* Message Input */}
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={handleSend}
          placeholder="Type a message..."
          className="flex-1 focus:border-none bg-transparent hover:bg-transparent outline-none border-none dark:placeholder:text-gray-400"
        />

        {/* Send Button */}
        <Button
          type="text"
          icon={<SendOutlined />}
          onClick={handleSend}
          className="text-blue-500 hover:text-blue-400"
        />
      </Flex>
    </div>
  );
};

export default ChatInput;
