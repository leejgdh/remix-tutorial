// app/routes/logout.tsx
import { redirect } from "@remix-run/node";
import { signOut } from "firebase/auth";
import { auth } from "~/auth/firebase-client";

export const loader = async () => {
  await signOut(auth);
  return redirect("/login");
};
