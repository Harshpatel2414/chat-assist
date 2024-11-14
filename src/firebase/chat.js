import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, onSnapshot, serverTimestamp, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from 'uuid';

class Chat {
  constructor() {
    this.db = db;
  }

  // Fetch chats for a user
  async getChats(callback) {
    try {
      const q = query(
        collection(db, 'Chats'),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((data) => data.user);
        callback(data)
      });
      return () => unsubscribe();
    } catch (error) {
      console.error('Error fetching chats:', error);
      return [];
    }
  }

  async addTag(chatId, tags) {
    const chatRef = doc(this.db, 'Chats', chatId);
    try {
      await updateDoc(chatRef, {
        tags: tags, 
      });
    } catch (error) {
      console.error("Error adding tag: ", error);
    }
  }

  getMessages(chatId, callback) {
    try {
      const messagesRef = query(
        collection(doc(db, 'Chats', chatId), 'messages'),
        orderBy("date", "asc")
      );

      const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        callback(messages);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching messages:', error);
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
  async addUser(selectedUser) {
    try {
      const chatRef = doc(db, "Chats", selectedUser.uid);
      const chatDoc = await getDoc(chatRef);

      if (!chatDoc.exists()) {
        // Create a new chat document if it doesn't exist
        await setDoc(chatRef, {
          lastMessage: '',
          date: serverTimestamp(),
          user: {
            displayName: selectedUser.name,
            photoURL: selectedUser.photoURL,
            uid: selectedUser.uid,
          },
        });

        // Create a nested empty `Messages` collection within this chat document
        const messagesCollectionRef = collection(db, "Chats", selectedUser.uid, "Messages");
        await setDoc(doc(messagesCollectionRef), {}); // Initial empty document in Messages
      }

      // if doc exist then update 
      await updateDoc(chatRef, {
        date: serverTimestamp()
      })
    } catch (error) {
      console.error('Error adding user:', error);
    }
  }

  // Send a message in a chat
  async sendMessage(chatId, data) {

    try {
      const messagesRef = collection(this.db, 'Chats', chatId, 'messages');

      const messageData = { date: serverTimestamp(), ...data };

      await addDoc(messagesRef, messageData);

      const chatRef = doc(this.db, "Chats", chatId);
      if (messageData.img) {
        await updateDoc(chatRef, {
          lastMessage: 'image',
          date: serverTimestamp(),
        });
      } else {
        await updateDoc(chatRef, {
          lastMessage: data.text,
          date: serverTimestamp(),
        });
      }

    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}

const ChatService = new Chat();

export default ChatService;
