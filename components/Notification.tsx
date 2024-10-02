"use client";
import { useEffect } from 'react';
import { messaging, getToken, onMessage } from '../lib/firebase';
import { buildApiUrl } from '@/app/lib/utils';
import Cookies from "js-cookie";

const NotificationComponent = () => {


  function notificationUnsupported(): boolean {
    let unsupported = false;
    if (
      !('serviceWorker' in navigator) ||
      !('PushManager' in window) ||
      !('showNotification' in ServiceWorkerRegistration.prototype)
    ) {
      unsupported = true;
    }
    return unsupported;
  }

  useEffect(() => {
    const registerServiceWorkerAndRequestPermission = async () => {
      if (notificationUnsupported()) {
        console.log('Notification support is not available in this browser.');
        return;
      }

      try {
        //Get idToken from cookies
        const idToken = Cookies.get("idToken");
        const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
        // Register service worker
        console.log("vapidKey", vapidKey);
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered successfully:', registration);

        const permission = await Notification.requestPermission();
        console.log("permission", permission);

        if (permission === 'granted') {
          const currentToken = await getToken(messaging, { 
            vapidKey: vapidKey,
            serviceWorkerRegistration: registration // Pass the registration
          });

          if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Send token to backend
            const url = buildApiUrl('/notifications/fcm-token');
            await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
              body: JSON.stringify({ token: currentToken }),
            });
          } else {
            console.log('No registration token available.');
          }
        } else {
          console.log('Notification permission not granted.');
        }
      } catch (error) {
        console.error('Error during service worker registration or token retrieval:', error);
      }
    };

    registerServiceWorkerAndRequestPermission();

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Customize notification handling here
    });
  }, []);

  return null;
};

export default NotificationComponent;
