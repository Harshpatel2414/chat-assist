'use client';

import { auth, authProvider, db } from '@/firebase/firebaseConfig'; // Import Firebase config
import { Alert, Button, Flex, Image, notification, Typography } from 'antd';
import { FaGoogle } from 'react-icons/fa6';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
const provider = new GoogleAuthProvider()

export default function HomePage() {
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      // Reference to the Firestore users and userChats collection
      const userDocRef = doc(db, 'Users', user.uid);
      const userChatsRef = doc(db, 'UserChats', user.uid);

      // Check if the user already exists in the 'users' collection
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // User already exists, just update the lastSeen field
        await updateDoc(userDocRef, {
          lastSeen: serverTimestamp(),
        });
        console.log("User already exists, lastSeen updated.");
      } else {
        // First time user, create new user document in 'users' collection
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName.toLowerCase(),
          email: user.email,
          photoURL: user.photoURL,
          lastSeen: serverTimestamp(),
        });
        // Create an empty document in 'userChats' collection
        await setDoc(userChatsRef, {});
        console.log("New user created and userChats initialized.");
      }
      // router.push('/chat'); 

    } catch (error) {
      <Alert type='error' message={error.message}/>
      console.error("Error during login: ", error);
    }
  };

  return (
    <Flex vertical align='center' justify='center' className='h-dvh gap-10 bg-main bg-no-repeat bg-center bg-cover'>
      <Image preview={false} src={'./logo_icon.png'} height={160} width={160} className='w-20 h-20 object-contain object-center'/>
        <Typography.Text className='dark:text-gray-50 text-blue-500 text-3xl font-semibold'>
          Assistance Chat
        </Typography.Text>
        <Button onClick={handleLogin} type='primary' icon={<FaGoogle />}>
          Sign in with Google
        </Button>
    </Flex>
  );
}
