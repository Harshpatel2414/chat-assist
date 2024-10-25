'use client';

import { auth, authProvider, db } from '@/firebase/firebaseConfig'; // Import Firebase config
import { Button, Flex, Image, Typography } from 'antd';
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
          name: user.displayName,
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
      console.error("Error during login: ", error);
    }
  };

  return (
    <Flex vertical align='center' justify='center' className='h-screen gap-10 bg-main bg-no-repeat bg-center bg-cover'>
      <Image preview={false} src={'./logo_big.png'} height={180} width={180} className='w-20 h-20 object-contain object-center'/>
      {/* <Typography.Title level={2} className='text-gray-500'>
        Welcome to Chat App
      </Typography.Title> */}
        <Button onClick={handleLogin} type='primary' icon={<FaGoogle />}>
          Sign in with Google
        </Button>
    </Flex>
  );
}
