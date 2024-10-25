import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from 'uuid';

class ChatService {
  constructor() {
    this.db = db;
  }

  // Fetch chats for a user
  async getChats(userId) {
    try {
      const userChatsRef = doc(this.db, 'UserChats', userId);
      const snapshot = await getDoc(userChatsRef);

      if (snapshot.exists()) {
        const chatsData = snapshot.data();
        const chatsArray = Object.entries(chatsData).sort(
          (a, b) => b[1].date - a[1].date
        );
        return chatsArray; // Return sorted chats array
      } else {
        return []; // Return empty array if no chats
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  }

  async getMessages(chatId) {
    try {
      const chatRef = doc(this.db, 'Chats', chatId);
      const snapshot = await getDoc(chatRef);

      if (snapshot.exists()) {
        const messagesData = snapshot.data();
        return messagesData.messages || []; 
      } else {
        return []; 
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  // Search for users by their name
  async searchUsers(searchTerm) {
    try {
      const usersRef = collection(this.db, 'Users');
      const q = query(usersRef, where("name", ">=", searchTerm), where("name", "<=", searchTerm + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      const users = [];

      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  // Add a new user to the chat
  async addUser(currentUser, selectedUser) {
    try {
      const chatId = currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;

      // Create or update the chat in UserChats
      const currentUserChatsRef = doc(this.db, "UserChats", currentUser.uid);
      const selectedUserChatsRef = doc(this.db, "UserChats", selectedUser.uid);

      await updateDoc(currentUserChatsRef, {
        [chatId]: {
          user: selectedUser,
          lastMessage: "",
          date: new Date()
        }
      });

      await updateDoc(selectedUserChatsRef, {
        [chatId]: {
          user: currentUser,
          lastMessage: "",
          date: new Date()
        }
      });

      return chatId;
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  // Send a message in a chat
  async sendMessage(chatId, senderId, messageText, language) {
    try {
      const chatRef = doc(this.db, "Chats", chatId);

      const messageData = {
        id: uuidv4(),
        senderId,
        text: messageText,
        timestamp: new Date(),
      };

      // Update chat with new message
      await updateDoc(chatRef, {
        messages: [...(await getDoc(chatRef)).data().messages, messageData] // Append new message
      });

      // Update the last message and date in UserChats
      const userChatRef = doc(this.db, "UserChats", senderId);
      await updateDoc(userChatRef, {
        [`${chatId}.lastMessage`]: messageText,
        [`${chatId}.date`]: new Date(),
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}

const chatService = new ChatService();
export default chatService;
