import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const AssistantInput = () => {
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const chatDocRef = doc(db, "Chats", currentUser.uid);
    const messagesCollectionRef = collection(chatDocRef, "messages");

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setLoading(true);

        const messageData = {
            senderId: currentUser.uid,
            text: newMessage,
            date: serverTimestamp(),
        };

        try {
            // Update last message in main chat document
            await setDoc(chatDocRef, {
                user:{
                    photoURL: currentUser.photoURL,
                    displayName: currentUser.displayName,
                },
                lastMessage: newMessage,
                date: serverTimestamp(),
            }, { merge: true });

            // Add new message to messages subcollection
            await addDoc(messagesCollectionRef, messageData);
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setNewMessage("");
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 items-center dark:bg-gray-700 p-2 drop-shadow-md">
            <Input
                placeholder="Write a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPressEnter={handleSendMessage}
                className="flex-1 focus:border-none dark:text-gray-300 dark:focus:text-gray-300 bg-transparent hover:bg-transparent outline-none border-none dark:placeholder:text-gray-400 focus:bg-transparent"
            />
            <Button
                icon={<SendOutlined />}
                disabled={loading}
                onClick={handleSendMessage}
                type="text"
                className='text-blue-500'
            />
        </div>
    );
};

export default AssistantInput;
