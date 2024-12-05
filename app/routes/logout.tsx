// app/routes/logout.tsx
import { redirect } from "@remix-run/node";
import { useFirebaseAuth } from "~/auth/firebase-context";

export const loader = async () => {

  return redirect("/login");
};


export default function Logout() {


  const { logout } = useFirebaseAuth();

  logout()
    .then(() => {
      redirect('/login')
    })

  return
}