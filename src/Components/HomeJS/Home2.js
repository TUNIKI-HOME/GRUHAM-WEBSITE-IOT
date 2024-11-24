import React, { useState, useEffect, useCallback } from 'react';
import { ref, onValue } from 'firebase/database'; // Import the necessary Firebase functions
import { database } from "../Firebase/Firebase"; // Import Firebase database
import styles from '../HomeCSS/Home2.module.css';
import { fetchDeviceStateFromFirebase, saveDeviceStateToFirebase, listenToDeviceStateChanges } from '../Firebase/Firebase';

const Home2 = () => {
  const [room, setRoom] = useState(null); // Store room data here
  const [deviceStates, setDeviceStates] = useState({}); // Store device states here
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors
  const [insideTemperature, setInsideTemperature] = useState(null); // Temperature state for inside
  const [outsideTemperature, setOutsideTemperature] = useState(null); // Temperature state for outside
  const [weatherLoading, setWeatherLoading] = useState(false); // Loading state for weather fetching

  const apiKey = '5e5cb14ad2c45b7c41e011b4a367c447'; // OpenWeatherMap API key
  const city = 'London'; // You can set a default city or make this dynamic based on user input

  // Fetch weather data based on the city
  const fetchWeatherData = useCallback(() => {
    if (city) {
      setWeatherLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=secunderabad&appid=${apiKey}&units=metric`; // Correct URL
      //https://api.openweathermap.org/data/2.5/weather?q=secunderabad&appid
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setOutsideTemperature(data.main?.temp || null);
          setWeatherLoading(false);
        })
        .catch(error => {
          setError("Failed to fetch outside weather data.");
          setWeatherLoading(false);
          console.error('Error fetching weather data:', error);
        });
    }
  }, [city, apiKey]);

  // Trigger weather data fetch when the component mounts or the city changes
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData]);

  // Fetch room data from Firebase when the component mounts
  useEffect(() => {
    const getRoomData = async () => {
      try {
        const data = await fetchDeviceStateFromFirebase();
        if (data && data['BeadRoom']) {
          const roomData = data['BeadRoom'];
          setRoom({ name: 'Bead Room', ...roomData });
          // Set the initial device states from Firebase
          setDeviceStates({
            lampsInside1: roomData.devices['BeadRoom-Lamps-Inside1']?.checked ?? false,
            lampsInside2: roomData.devices['BeadRoom-Lamps-Inside2']?.checked ?? false,
            fan: roomData.devices['BeadRoom-Fans']?.checked ?? false,
            wifi: roomData.devices['BeadRoom-Wi-Fi']?.checked ?? false,
          });
        } else {
          setRoom(null); // No data for Bead Room
        }
      } catch (error) {
        setError("Failed to fetch room data.");
        console.error(error);
      } finally {
        setLoading(false); // Stop loading after data is fetched or error occurred
      }
    };

    getRoomData();
  }, []);

  // Fetch temperature and humidity from Firebase's sensorData
  useEffect(() => {
    const fetchSensorData = () => {
      const sensorRef = ref(database, 'users/FTuohQjo1mUCyaOuw24B9joHN9y1/rooms/BeadRoom/sensorData');
      onValue(sensorRef, (snapshot) => {
        const sensorData = snapshot.val();
        if (sensorData) {
          setInsideTemperature(sensorData.temperature || null);
        } else {
          console.error("No sensor data found.");
        }
      }, (error) => {
        setError("Failed to fetch sensor data.");
        console.error(error);
      });
    };

    if (room) {
      fetchSensorData();
    }
  }, [room]); // Only fetch sensor data if room is set

  // Real-time listeners for device state updates
  useEffect(() => {
    if (room && room.name) {
      const unsubscribe = [
        listenToDeviceStateChanges('BeadRoom', 'BeadRoom-Lamps-Inside1', (newState) => {
          setDeviceStates(prevState => ({ ...prevState, lampsInside1: newState.checked }));
        }),
        listenToDeviceStateChanges('BeadRoom', 'BeadRoom-Lamps-Inside2', (newState) => {
          setDeviceStates(prevState => ({ ...prevState, lampsInside2: newState.checked }));
        }),
        listenToDeviceStateChanges('BeadRoom', 'BeadRoom-Fans', (newState) => {
          setDeviceStates(prevState => ({ ...prevState, fan: newState.checked }));
        }),
        listenToDeviceStateChanges('BeadRoom', 'BeadRoom-Wi-Fi', (newState) => {
          setDeviceStates(prevState => ({ ...prevState, wifi: newState.checked }));
        })
      ];

      // Cleanup function to unsubscribe when component unmounts
      return () => {
        unsubscribe.forEach(unsub => unsub());
      };
    }
  }, [room]);

  const handleDeviceToggle = async (deviceId) => {
    try {
      const newState = !deviceStates[deviceId];
      setDeviceStates(prevState => ({
        ...prevState,
        [deviceId]: newState,
      }));
      await saveDeviceStateToFirebase('BeadRoom', deviceId, newState);
    } catch (error) {
      console.error("Failed to update device state:", error);
    }
  };

  if (loading || weatherLoading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  if (!room) {
    return <div>No data available for the Bead Room</div>;
  }

  return (
    <div className={styles.homeSystem}>
      <div className={styles.status}>
        {/* Lamps Inside 1 */}
        <div className={`${styles.statusItem} ${styles.lights}`}>
          <h3>Lamps-Inside-1</h3>
          <span className={styles.span}>1 Lamp-Inside-1</span>
          <span className={styles.span} onClick={() => handleDeviceToggle('lampsInside1')}>
            {deviceStates.lampsInside1 ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Lamps Inside 2 */}
        <div className={`${styles.statusItem} ${styles.lights}`}>
          <h3>3-Pin Socket</h3>
          <span className={styles.span}>3-Pin Socket</span>
          <span className={styles.span} onClick={() => handleDeviceToggle('lampsInside2')}>
            {deviceStates.lampsInside2 ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Fan */}
        <div className={`${styles.statusItem} ${styles.lights}`}>
          <h3>Fan</h3>
          <span className={styles.span}>1 Fan</span>
          <span className={styles.span} onClick={() => handleDeviceToggle('fan')}>
            {deviceStates.fan ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Wi-Fi */}
        <div className={`${styles.statusItem} ${styles.lights}`}>
          <h3>WI-FI</h3>
          <span className={styles.span}>WI-Fi</span>
          <span className={styles.span} onClick={() => handleDeviceToggle('wifi')}>
            {deviceStates.wifi ? 'ON' : 'OFF'}
          </span>
        </div>

        {/* Temperature */}
        <div className={`${styles.statusItem} ${styles.temperature}`}>
          <span>TEMPERATURE</span>
          <div>
            <span className={styles.spant}>Inside the Room</span>
            <span className={styles.spant}>
              {insideTemperature !== null ? `${insideTemperature}°C` : 'No data loading...'}
            </span>
          </div>
          <div>
            <span className={styles.spant}>Outside the Room</span>
            <span className={styles.spant}>
              {outsideTemperature !== null ? `${outsideTemperature}°C` : 'Loading...'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home2;
