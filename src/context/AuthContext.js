import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    "uid": "xR55hMpAFuOTutV1wrqNe5BtnSh2",
    "email": "harshalpateljnv@gmail.com",
    "emailVerified": true,
    "displayName": "Harshal Patel",
    "isAnonymous": false,
    "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIT3pW5nFgx7vrkvDmU2f9Un1q2WoGGDCgOz7bH0W08HyJKE1fE=s96-c",
    "providerData": [
        {
            "providerId": "google.com",
            "uid": "112998469038655058975",
            "displayName": "Harshal Patel",
            "email": "harshalpateljnv@gmail.com",
            "phoneNumber": null,
            "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIT3pW5nFgx7vrkvDmU2f9Un1q2WoGGDCgOz7bH0W08HyJKE1fE=s96-c"
        }
    ],
    "stsTokenManager": {
        "refreshToken": "AMf-vBzBuBlGhGXWZyKJpMLoTdlnrExxAdpbrMZGNWm_35B7GXcLW0NtgGDV_h5zaDwyUGvkcXjy5UotTbuPky1DVwVq4LgRzL2g91VtMyqSWOJ1Oo0uLI_1NiQZHSNdFxwqMxDqhhw2FQwjCz6ICjsLFSkXnkJeD299nY4rM0R8vaVJQ9JuDZhWsMDpVIMiY3sNAqnTjo71Lwu2GLlAV_fFfgn8GuNgXbB7NE7cYKN5ZRX8-0TJO94g04HIJd11obZ84_6NVoNBgHub588poaEWEb14kr_UNFNO8l0foIsTTXBCSShg0Do6qomWT_0Sf1Tki1l6Q7AFfG0YRCBML5hKcArahUfJTpGVk-_3_56f9S8Ezkgqt3q7JkS1hOdeLbokz2veN-pQ0Nb9e4rEbe8KkY50ubfjGDsugd_rz0qtik7Uc-LPbrZ4_1TQy5ubczP8283VVxiEX9EwyQIsPvJVkT3fn3s33g",
        "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFlNTIxYmY1ZjdhNDAwOGMzYmQ3MjFmMzk2OTcwOWI1MzY0MzA5NjEiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSGFyc2hhbCBQYXRlbCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJVDNwVzVuRmd4N3Zya3ZEbVUyZjlVbjFxMldvR0dEQ2dPejdiSDBXMDhIeUpLRTFmRT1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9jaGF0LWFzc2lzdGFuY2UtNDgwYWIiLCJhdWQiOiJjaGF0LWFzc2lzdGFuY2UtNDgwYWIiLCJhdXRoX3RpbWUiOjE3MzE1MjAyNzUsInVzZXJfaWQiOiJ4UjU1aE1wQUZ1T1R1dFYxd3JxTmU1QnRuU2gyIiwic3ViIjoieFI1NWhNcEFGdU9UdXRWMXdycU5lNUJ0blNoMiIsImlhdCI6MTczMTU0MDEwMiwiZXhwIjoxNzMxNTQzNzAyLCJlbWFpbCI6ImhhcnNoYWxwYXRlbGpudkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjExMjk5ODQ2OTAzODY1NTA1ODk3NSJdLCJlbWFpbCI6WyJoYXJzaGFscGF0ZWxqbnZAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.NeCP8g4aNNTYHiLyWFJR9L2gwWrRp8sOg0OPSecAC58YuQv1Gxw98V8XkyEbpm_zQol6tksZ4y-tl-RxY_e4cdpP8k13kE3VbzjL1ptM28j8KOOg5elQxo8ue2WirWTSic7V-lbydvKdt-mBT8kwPfCtxfPTvAGj_y3Dep02AJB82r6K5GSbAxSYDGDyT1ZCeJmEmTtMQdxbW7G8JM2Q77hpqZ7eJPhfpqJWVbUm4A4okDSMGZzlbT9MiQtzQfLOuFxG2HAAS7s9X_tuaeIrToiWi1KrkVfOAhRNZlu7B9J0w8D6IhFF_uDGnG8KLr4GBNDfkkz12qi-8Qpvw6HAcQ",
        "expirationTime": 1731543701989
    },
    "createdAt": "1728374581358",
    "lastLoginAt": "1731520275015",
    "apiKey": "AIzaSyDRztAULZSrmscYB4idkEuBHQLGORoSn-4",
    "appName": "[DEFAULT]"
});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user && user.uid === 'xR55hMpAFuOTutV1wrqNe5BtnSh2') {
        setCurrentUser(user);
        router.push('/chat');
      } else if(user && user.uid != 'xR55hMpAFuOTutV1wrqNe5BtnSh2') {
        setCurrentUser(user);
        router.push('/support');
      } else{
        router.push('/')
      }
    });
    return () => unsubscribe();
  }, []);

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
