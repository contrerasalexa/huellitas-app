import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCN9fiy4cGXS3cra4CoD7TeOOGmTjhE1UQ",
    authDomain: "app-perritos-2e310.firebaseapp.com",
    projectId: "app-perritos-2e310",
    storageBucket: "app-perritos-2e310.firebasestorage.app",
    messagingSenderId: "990899140500",
    appId: "1:990899140500:web:ba6c1deb3fcf027d7f0181"
    };

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
