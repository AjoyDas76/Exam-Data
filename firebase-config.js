// ==========================================================================
// আপনার Firebase প্রজেক্টের কনফিগারেশন (exam-data-26)
// ==========================================================================

const firebaseConfig = {
  apiKey: "AIzaSyB5mV6bfnbMVemTIJ2PnL-9xTXcRmudkLo",
  authDomain: "exam-data-26.firebaseapp.com",
  databaseURL: "https://exam-data-26-default-rtdb.firebaseio.com",
  projectId: "exam-data-26",
  storageBucket: "exam-data-26.firebasestorage.app",
  messagingSenderId: "909295283086",
  appId: "1:909295283086:web:7b2716925b7dd15855d2df"
};

firebase.initializeApp(firebaseConfig);

// পুরো index.html জুড়ে এই গ্লোবাল ভ্যারিয়েবলগুলো ব্যবহার হবে
const rtdb = firebase.database();
const auth = firebase.auth();
