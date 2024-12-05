import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Auth, connectAuthEmulator, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

interface FirebaseContextType {
  user: User | null;
  //loading: boolean;
  login: (email : string, password : string) => Promise<void>;
  logout: () => Promise<void>;
  register : (email : string, password : string) => Promise<void>;
}

export type FirebaseConfig  = {
  apiKey : string,
  authDomain : string,
  projectId  :string,
  storageBucket : string,
  messagingSenderId : string,
  appId : string,
  measurementId : string
}

const AuthContext = createContext<FirebaseContextType | undefined>(undefined);


export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode, config : FirebaseConfig }> = ({ children, config }) => {

  console.log('config',config);

  const [auth, setAuth ] = useState<Auth | null>(null);
  const [user, setUser] = useState<User | null>(null);
  //const [loading, setLoading] = useState(true);


  useEffect(() => {
    const firebaseApp = initializeApp(config);
    if (typeof window !== "undefined") {
      setAuth(getAuth(firebaseApp));
      if (process.env.NODE_ENV === "development" && auth) {
        connectAuthEmulator(auth, "http://localhost:9099");
      }
    }

    if(auth){
      onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser(firebaseUser); // 인증된 사용자 정보 설정
        } else {
          setUser(null); // 사용자 로그아웃 시 null
        }
      });
    }
  
    
  },[auth, config])

  const login = useCallback(async (email : string, password : string) => {
    if(auth){
      const signInRes =  await signInWithEmailAndPassword(auth, email, password);
      console.log('signInRes',signInRes);
    }
  },[auth]);

  const logout = useCallback(async () => {
    if(auth)
      await signOut(auth)
  },[auth])

  const register = useCallback(async (email : string, password : string) => {
    if(auth){
      const signInRes = await createUserWithEmailAndPassword(auth , email, password)

      console.log(signInRes);
    }
  },[auth]);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a FirebaseAuthProvider');
  }
  return context;
};
