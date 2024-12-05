import React from "react";
import { Navigate, useLocation } from "@remix-run/react";
import { useFirebaseAuth } from "./firebase-context";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // 비로그인 시 보여줄 컴포넌트
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const { user } = useFirebaseAuth();
  const location = useLocation();

  if (!user) {
    // 비로그인 상태일 경우 fallback 또는 로그인 페이지로 리다이렉트
    return fallback ? (
      <>{fallback}</>
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  // 로그인된 상태라면 children 표시
  return <>{children}</>;
};

export default AuthGuard;
