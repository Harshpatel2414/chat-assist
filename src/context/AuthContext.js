import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, Timestamp, updateDoc } from 'firebase/firestore';
import { db as firestoreDb } from '@/firebase/firebaseConfig'; // Firestore instance

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setCurrentUser(user);
        router.push('/chat');
      } else {
        router.push('/');
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const handleConnectionChange = () => {
        const isOnline = navigator.onLine;
        updateUserOnlineStatus(currentUser.uid, isOnline);
      };

      // Set initial online status
      handleConnectionChange();

      // Update user status periodically
      const intervalId = setInterval(handleConnectionChange, 60000);

      // Add event listeners for online and offline events
      window.addEventListener('online', handleConnectionChange);
      window.addEventListener('offline', handleConnectionChange);

      // Cleanup on unmount
      return () => {
        clearInterval(intervalId);
        window.removeEventListener('online', handleConnectionChange);
        window.removeEventListener('offline', handleConnectionChange);
        updateUserOnlineStatus(currentUser.uid, false); // Mark user offline
      };
    }
  }, [currentUser]);

  const updateUserOnlineStatus = async (userId, isOnline) => {
    const statusForFirestore = {
      online: isOnline,
      lastSeen: Timestamp.now(),
    };

    // Update the user's online status in Firestore
    await updateDoc(doc(firestoreDb, 'Users', userId), statusForFirestore);
  };

  const logOut = async () => {
    if (currentUser) {
      await updateUserOnlineStatus(currentUser.uid, false);
      await signOut(auth);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, logOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
