import { Input, Button, Flex } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/firebase/firebaseConfig";
import {
  doc,
  collection,
  addDoc,
  serverTimestamp,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const AssistantInput = () => {
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const chatDocRef = doc(db, "Chats", currentUser.uid);
  const messagesCollectionRef = collection(chatDocRef, "messages");

  const handleSendMessage = async () => {
    if (newMessage.trim().length < 1) return;

    setLoading(true);

    const messageData = {
      senderId: currentUser.uid,
      text: newMessage,
      date: serverTimestamp(),
    };

    try {
      const chatDocSnapshot = await getDoc(chatDocRef);

      if (chatDocSnapshot.exists()) {
        await updateDoc(
          chatDocRef,
          {
            lastMessage: newMessage,
            date: serverTimestamp(),
          }
        );
      } else {
        await setDoc(chatDocRef, {
          user: {
            photoURL: currentUser.photoURL,
            displayName: currentUser.displayName,
          },
          lastMessage: newMessage,
          date: serverTimestamp(),
        });
      }

      await addDoc(messagesCollectionRef, messageData);

    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setNewMessage("");
      setLoading(false);
    }
  };

  return (
    <Flex className="flex gap-1 items-center dark:bg-gray-700 p-2 drop-shadow-md">
      <Input
        placeholder="Write a message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onPressEnter={handleSendMessage}
        className="flex-1 focus:border-none dark:text-gray-300 dark:focus:text-gray-300 bg-transparent hover:bg-transparent dark:bg-gray-600 focus:outline-none border-none dark:placeholder:text-gray-400 focus:bg-transparent"
      />
      <Button
        icon={<SendOutlined />}
        disabled={loading}
        onClick={handleSendMessage}
        type="text"
        className="text-blue-500"
      />
    </Flex>
  );
};

export default AssistantInput;
