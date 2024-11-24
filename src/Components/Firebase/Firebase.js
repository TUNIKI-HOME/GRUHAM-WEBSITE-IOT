import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set, get, onValue } from "firebase/database";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFsaD6S0K5Y--8xKxOQLVEoT-MMpbYBvI",
  authDomain: "gruham-app.firebaseapp.com",
  databaseURL: "https://gruham-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "gruham-app",
  storageBucket: "gruham-app.firebasestorage.app",
  messagingSenderId: "733238816248",
  appId: "1:733238816248:web:5d3a70dbb0e731245bba0d",
  measurementId: "G-85BCNRJ5ST"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Auth
const database = getDatabase(app); // Firebase Realtime Database
export { app, auth, database };
const db = getDatabase(app);

// Save user profile data to Firebase
export const saveProfileToFirebase = (profile) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const profileRef = ref(database, `users/${user.uid}/profile`); // Corrected string interpolation
  set(profileRef, profile);
};

// Fetch user profile data from Firebase
export const getProfileFromFirebase = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const profileRef = ref(database, `users/${user.uid}/profile`); // Corrected string interpolation
  try {
    const snapshot = await get(profileRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // No data found
    }
  } catch (error) {
    console.error("Error fetching profile: ", error);
    throw new Error("Error fetching profile from Firebase");
  }
};

// Save device state to Firebase (specific room and device)
export const saveDeviceStateToFirebase = (roomName, deviceId, state) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const deviceRef = ref(database, `users/${user.uid}/rooms/${roomName}/devices/${deviceId}`); // Corrected string interpolation
  set(deviceRef, { checked: state });
};

// Fetch device state from Firebase (for a specific room)
export const fetchDeviceStateFromFirebase = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const devicesRef = ref(database, `users/${user.uid}/rooms`); // Corrected string interpolation
  try {
    const snapshot = await get(devicesRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // No data found
    }
  } catch (error) {
    console.error("Error fetching device state: ", error);
    throw new Error("Error fetching device state from Firebase");
  }
};

// Function to save "profit" or "on device count" data for each room
export const saveProfitData = (roomName, onCount) => {
  set(ref(db, `rooms/${roomName}/profit`), onCount);
};

// Real-time listener for device state changes
export const listenToDeviceStateChanges = (roomName, deviceId, callback) => {
  const deviceRef = ref(database, `rooms/${roomName}/devices/${deviceId}`);
  return onValue(deviceRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  }, (error) => {
    console.error("Error listening to device state changes:", error);
  });
};

// Fetch sensor data (e.g., temperature, humidity) for a specific room
export const fetchSensorDataFromFirebase = async (roomName) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User is not authenticated");
  }

  const sensorDataRef = ref(database, `users/${user.uid}/rooms/${roomName}/sensorData`); // Corrected string interpolation
  try {
    const snapshot = await get(sensorDataRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null; // No sensor data found
    }
  } catch (error) {
    console.error("Error fetching sensor data: ", error);
    throw new Error("Error fetching sensor data from Firebase");
  }
};
