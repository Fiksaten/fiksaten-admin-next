// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyBxLKuFQ_X7uTDXjf3OJeaSxd5Gw7fVscM",
    authDomain: "fiksaten.firebaseapp.com",
    projectId: "fiksaten",
    storageBucket: "fiksaten.appspot.com",
    messagingSenderId: "113755236667",
    appId: "1:113755236667:web:1a20f19e0669c59cee2f1e",
    measurementId: "G-1JJXPL546P"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification?.title || 'Background Message Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Background Message body.',
    icon: '/icon.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
