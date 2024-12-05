import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Auth, connectAuthEmulator, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

interface FirebaseContextType {
  user: User | null;
  //loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
}

export type FirebaseConfig = {
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
  measurementId: string
}

const AuthContext = createContext<FirebaseContextType | undefined>(undefined);


export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode, config: FirebaseConfig }> = ({ children, config }) => {

  const [auth, setAuth] = useState<Auth | null>(null);

  const [user, setUser] = useState<User | null>(null);
  //const [loading, setLoading] = useState(true);


  useEffect(() => {
   
    const initializeFirebase = async () => {
      const firebaseApp = initializeApp(config);
      const authInstance = getAuth(firebaseApp);

      console.log('firbase init')
  
      if (process.env.NODE_ENV === "development") {
        connectAuthEmulator(authInstance, "http://localhost:9099");
      }
  
      setAuth(authInstance);
  
      onAuthStateChanged(authInstance, (firebaseUser) => {
        console.log('on auth state changed',firebaseUser);

        if (firebaseUser) {
          setUser(firebaseUser); // 인증된 사용자 정보 설정

          console.log('auth user',user);
        } else {
          setUser(null); // 로그아웃 상태
        }
      });
    };
  
    initializeFirebase();

  }, [config])

  useEffect(() => {
    console.log('effect user',user);
  },[user])

  const login = useCallback(async (email: string, password: string) => {
    if (!auth) return;
  
    try {
      const signInRes = await signInWithEmailAndPassword(auth, email, password);
      setUser(signInRes.user); // 로그인 후 상태 수동 업데이트
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  }, [auth]);

  const logout = useCallback(async () => {
    if (auth)
      await signOut(auth)
  }, [auth])

  const register = useCallback(async (email: string, password: string) => {
    if (auth) {
      const signInRes = await createUserWithEmailAndPassword(auth, email, password)

      console.log(signInRes);
    }
  }, [auth]);

  const memoizedValue = useMemo(
    () => ({
      user: user,
      login,
      register,
      logout,
    }),
    [login, logout, register, user]
  );


  return (
    <AuthContext.Provider value={memoizedValue}>
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
