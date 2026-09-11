// ==========================================================
// GANTI seluruh nilai di bawah ini dengan config dari project
// Firebase kamu sendiri.
//
// Cara mendapatkannya:
// 1. Buka https://console.firebase.google.com
// 2. Buat project baru (atau pakai yang sudah ada)
// 3. Klik ikon web "</>" untuk menambahkan Web App
// 4. Copy object firebaseConfig yang muncul, tempel di sini
// ==========================================================

const firebaseConfig = {
  apiKey: "GANTI_DENGAN_API_KEY_KAMU",
  authDomain: "GANTI.firebaseapp.com",
  projectId: "GANTI_PROJECT_ID",
  storageBucket: "GANTI.appspot.com",
  messagingSenderId: "GANTI_SENDER_ID",
  appId: "GANTI_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
