import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user && user.uid === process.env.NEXT_PUBLIC_ADMIN_ID) {
        setCurrentUser(user);
        router.push('/admin/chat');
      } else if (user) {
        setCurrentUser(user);
        router.push('/support');
      } else {
        router.push('/')
      }
    });
    return () => unsubscribe();
  }, [currentUser, router]);

  const logOut = async () => {
    if (currentUser) {
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
