// firebase-client.ts
// import { initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: "AIzaSyCMnFYaaJttLZsLjgcs-ph4beEbdJc3ZKk",
//   authDomain: "dh-remix-app.firebaseapp.com",
//   projectId: "dh-remix-app",
//   storageBucket: "dh-remix-app.firebasestorage.app",
//   messagingSenderId: "513687438891",
//   appId: "1:513687438891:web:341d48093b1bf4e61ccc6e",
//   measurementId: "G-5E95P1B386",
// };


// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
// };

// export const firebaseApp = initializeApp(firebaseConfig);

// let auth: Auth | null = null;

// if (typeof window !== "undefined") {
//   auth = getAuth(firebaseApp);

//   if (process.env.NODE_ENV === "development") {
//     connectAuthEmulator(auth, "http://localhost:9099");
//   }
// }

// export { auth };