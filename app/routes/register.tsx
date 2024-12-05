// app/routes/register.tsx
import { Form } from "@remix-run/react";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { useState } from "react";
import { useFirebase } from "~/auth/firebase-context";

export default function Register() {

  const { auth } = useFirebase();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!auth) {
      setError("Firebase Auth가 초기화되지 않았습니다.");
      return;
    }

    try {
      const signupRes : UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      console.log(signupRes);
      
      setSuccessMessage("회원가입에 성공했습니다!");
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.log(`Error Code: ${err.code}`);
        console.log(`Error Message: ${err.message}`);
        setError(`회원가입 실패: ${err.message}`);
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
      <button type="submit">회원가입</button>

      {
        successMessage && <>{successMessage}</>
      }
      
      {
        error && <>{error}</>
      }
    </Form>
  );
}
