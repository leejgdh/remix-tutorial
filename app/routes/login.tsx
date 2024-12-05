// app/routes/login.tsx
import { Form, useNavigate } from "@remix-run/react";
import { FirebaseError } from "firebase/app";
import { useEffect, useState } from "react";
import { useFirebaseAuth } from "~/auth/firebase-context";

export default function Login() {

  const { user, login } = useFirebaseAuth();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navi = useNavigate();

  useEffect(() => {

    if(user){
      navi("/");
    }

  },[user])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {

      const signInRes = await login(email, password);

      console.log('signInRes', signInRes);

      setSuccessMessage("로그인에 성공했습니다!");

      navi('/');
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.log(`Error Code: ${err.code}`);
        console.log(`Error Message: ${err.message}`);
        setError(`로그인 실패: ${err.message}`);
      } else {
        console.error("Unknown error occurred", err);
        setError("알 수 없는 오류가 발생했습니다.");
      }
    }
  };


  return (
    <Form method="post" onSubmit={handleSubmit}>
      <div>
        <label>
          이메일: <input type="email" name="email" required />
        </label>
      </div>
      <div>
        <label>
          비밀번호: <input type="password" name="password" required />
        </label>
      </div>
      <button type="submit">로그인</button>

      {
        successMessage && <>{successMessage}</>
      }

      {
        error && <>{error}</>
      }
    </Form>
  );
}
