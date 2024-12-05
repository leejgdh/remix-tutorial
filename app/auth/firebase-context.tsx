// app/context/firebase-context.tsx
import { createContext, useContext } from "react";
import type { Auth } from "firebase/auth";
import { auth } from "./firebase-client";

// Context 타입 정의
type FirebaseContextType = {
  auth: Auth | null;
};

// Context 생성
const FirebaseContext = createContext<FirebaseContextType>({
  auth: null, // 기본값
});

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <FirebaseContext.Provider value={{ auth }}>
      {children}
    </FirebaseContext.Provider>
  );
};
