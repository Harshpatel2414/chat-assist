"use client";

import React, { useEffect, useState } from "react";
import {
  Typography,
  Popover,
  Button,
  Select,
  Space,
  Image,
  Flex,
} from "antd";
import {
  MoreOutlined,
  TranslationOutlined,
  SettingOutlined,
  SyncOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/AuthContext";
import { Timestamp } from "firebase/firestore";

const { Text } = Typography;
const { Option } = Select;

const AssistantMessage = ({ message, isLastMessage }) => {
  const [formattedTime, setFormattedTime] = useState("");
  const [displayText, setDisplayText] = useState(message.text);
  const [translatedText, setTranslatedText] = useState(null);
  const [language, setLanguage] = useState("mr");
  const [showTranslateIcon, setShowTranslateIcon] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { text, date, senderId } = message;

  // Format message timestamp
  const formatTime = (firebaseTimestamp) => {
    const messageDate =
      firebaseTimestamp instanceof Timestamp
        ? firebaseTimestamp.toDate()
        : new Date(firebaseTimestamp);

    const now = new Date();
    const differenceInSeconds = Math.floor((now - messageDate) / 1000);

    return isLastMessage && differenceInSeconds < 30
      ? "Just now"
      : messageDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  };

  // Translate message text
  const handleTranslate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${text}&langpair=en|${language}`
      );
      const data = await response.json();
      if (data.responseData) {
        setTranslatedText(data.responseData.translatedText);
        setDisplayText(data.responseData.translatedText);
      }
    } catch (error) {
      console.error("Error translating text:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset to original text
  const handleShowOriginal = () => {
    setDisplayText(text);
    setTranslatedText(null);
  };

  // Handle language selection change
  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  // Set formatted time on initial load
  useEffect(() => {
    setFormattedTime(formatTime(date));
    const intervalId = setInterval(() => {
      setFormattedTime(formatTime(date));
    }, 60000);
    return () => clearInterval(intervalId);
  }, [date]);

  return (
    <div
      className={`flex flex-col p-2 rounded-lg relative ${
        currentUser.uid === senderId ? "items-end" : "items-start"
      }`}
      onMouseEnter={() => setShowTranslateIcon(true)}
      onMouseLeave={() => setShowTranslateIcon(false)}
    >
      <div
        className={`flex w-full ${
          currentUser.uid === senderId ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex drop-shadow-md p-2 rounded-lg h-fit w-fit max-w-[80%] ${
            currentUser.uid === senderId
              ? "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-tr-none"
              : "bg-blue-500 dark:bg-blue-800 text-gray-100 rounded-tl-none"
          }`}
        >
          {message.img || message.video ? (
            <>
              {message.img && (
                <Flex vertical>
                  <Image
                    src={message.img}
                    alt="media"
                    className={`${
                      currentUser
                        ? "dark:bg-gray-700 bg-gray-200"
                        : "bg-blue-400"
                    }  w-full min-h-44 max-w-60 max-h-44 object-center object-cover rounded-lg`}
                  />
                  {message.text && (
                    <Typography.Paragraph
                      style={{ marginBottom: 0 }}
                      className="mt-1 mb-0 text-gray-50"
                    >
                      {text}
                    </Typography.Paragraph>
                  )}
                </Flex>
              )}
              {message.video && (
                <Flex vertical>
                  <video
                    controls
                    className={`${
                      currentUser
                        ? "dark:bg-gray-700 bg-gray-200"
                        : "bg-blue-400"
                    } max-h-44 max-w-60 min-w-60 min-h-44 w-full object-center object-contain rounded-lg`}
                    src={message.video}
                  />
                  {message.text && (
                    <Typography.Paragraph
                      style={{ marginBottom: 0 }}
                      className="mt-1 mb-0 text-gray-50"
                    >
                      {text}
                    </Typography.Paragraph>
                  )}
                </Flex>
              )}
            </>
          ) : (
            <Text
              className={`text-base text-justify ${
                currentUser.uid === senderId
                  ? "text-right text-gray-600 dark:text-gray-300"
                  : "text-left text-gray-100"
              }`}
            >
              {displayText}
            </Text>
          )}
        </div>
        {showTranslateIcon && !message.img && !message.video && (
          <Popover
            content={
              <Space direction="vertical">
                {translatedText ? (
                  <Button
                    icon={<UndoOutlined />}
                    type="text"
                    onClick={handleShowOriginal}
                  >
                    Original
                  </Button>
                ) : (
                  <Button
                    icon={<TranslationOutlined />}
                    type="text"
                    onClick={handleTranslate}
                  >
                    Translate
                  </Button>
                )}
                <Popover
                  trigger="click"
                  placement="right"
                  content={
                    <Select
                      defaultValue="mr"
                      style={{ width: 120 }}
                      onChange={handleLanguageChange}
                    >
                      <Option value="en">English</Option>
                      <Option value="hi">Hindi</Option>
                      <Option value="mr">Marathi</Option>
                    </Select>
                  }
                >
                  <Button
                    icon={<SettingOutlined />}
                    type="text"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Settings
                  </Button>
                </Popover>
              </Space>
            }
            trigger="click"
          >
            <Button
              type="text"
              icon={loading ? <SyncOutlined spin /> : <MoreOutlined />}
              className="mx-2 my-auto text-blue-700"
            />
          </Popover>
        )}
      </div>
      <Text
        className={`text-xs text-gray-500 block mt-1 ${
          currentUser.uid === senderId ? "text-right" : "text-left"
        }`}
      >
        {formattedTime}
      </Text>
    </div>
  );
};

export default AssistantMessage;
