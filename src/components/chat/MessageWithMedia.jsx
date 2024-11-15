import { useAuth } from "@/context/AuthContext";
import { Image, Typography, Flex } from "antd";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function MessageWithMedia({ message, isLastMessage }) {
  const { currentUser } = useAuth();
  const [formattedTime, setFormattedTime] = useState("");
  const { text, date, senderId } = message;


  // Function to format the timestamp
  const formatTime = (firebaseTimestamp) => {
    const messageDate =
      firebaseTimestamp instanceof Timestamp
        ? firebaseTimestamp.toDate()
        : new Date(firebaseTimestamp);

    const now = new Date();
    const differenceInSeconds = Math.floor((now - messageDate) / 1000);

    // Show "Just now" for recent messages if sent within 30 seconds
    if (isLastMessage && differenceInSeconds < 30) {
      return "Just now";
    }

    // Return formatted time in "HH:MM AM/PM" format
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Update the formatted time when the date or message status changes
  useEffect(() => {
    setFormattedTime(formatTime(date));
    const intervalId = setInterval(() => {
      setFormattedTime(formatTime(date));
    }, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, [date, isLastMessage]);

  // Determine if the message is sent by the current user
  const isCurrentUser = currentUser.uid === senderId;

  return (
    <Flex
      vertical
      className={`p-2 rounded-lg ${
        isCurrentUser ? "items-end" : "items-start"
      } mb-4`}
    >
      <Flex
        vertical
        className={`drop-shadow-md p-2 rounded-lg max-w-[80%] w-full min-w-80 md:w-96 lg:max-w-[90%] 
          ${isCurrentUser
            ? 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-200 rounded-tr-none'
            : 'bg-blue-500 dark:bg-blue-800 text-gray-100 rounded-tl-none'
          }`}
      >
        {message.img && (
          <Image
            src={message.img}
            alt="media"
            className={`${isCurrentUser ? 'dark:bg-gray-700 bg-gray-200':'bg-blue-400 dark:bg-blue-900' }  w-full min-h-80 max-h-80 object-center object-cover rounded-lg`}
          />
        )}
        {message.video && (
          <video
            controls
            className={`${
              isCurrentUser ? "dark:bg-gray-700 bg-gray-200" : "bg-blue-400 dark:bg-blue-900"
            } max-h-60 min-h-52 h-fit w-full object-center object-contain rounded-lg`}
            src={message.video}
          />
        )}
        {text && (
          <Typography.Paragraph
            style={{ marginBottom: 0 }}
            className="mt-1 mb-0 text-gray-50"
          >
            {text}
          </Typography.Paragraph>
        )}
      </Flex>
      <Typography.Text className="text-xs text-right text-gray-400 mt-1">
        {formattedTime}
      </Typography.Text>
    </Flex>
  );
}
