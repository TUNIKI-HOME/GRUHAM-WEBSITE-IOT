import React, { useEffect, useState } from 'react';
import styles from '../HomeCSS/Roomes.module.css';
import { FaTemperatureHigh, FaPowerOff, FaShieldAlt } from 'react-icons/fa';
import { fetchDeviceStateFromFirebase, fetchSensorDataFromFirebase } from '../Firebase/Firebase';

const Rooms = () => {
  const [room, setRoom] = useState(null); // Store room data here
  const [sensorData, setSensorData] = useState(null); // Store sensor data here
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null); // To handle errors

  useEffect(() => {
    // Fetch room and sensor data from Firebase when the component mounts
    const getRoomData = async () => {
      try {
        const data = await fetchDeviceStateFromFirebase();
        if (data && data['BeadRoom']) {
          setRoom({ name: 'Bead Room', ...data['BeadRoom'] });
        } else {
          setRoom(null); // No data for Bead Room
        }

        // Fetch the sensor data for the room
        const fetchedSensorData = await fetchSensorDataFromFirebase('BeadRoom');
        if (fetchedSensorData) {
          setSensorData(fetchedSensorData);  // Set the sensor data for temperature, humidity, etc.
        } else {
          setSensorData(null); // No sensor data available
        }
      } catch (error) {
        setError("Failed to fetch data from Firebase.");
        console.error(error);
      } finally {
        setLoading(false); // Stop loading after data is fetched or error occurred
      }
    };

    getRoomData();
  }, []); // Empty dependency array to run this effect only once after the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  if (!room) {
    return <div>No data available for the Bead Room</div>;
  }

  // Destructure status and devices with default values to avoid undefined issues
  const { status = {}, devices = {} } = room;
  const { powerOn = false, security = false, motionRecognition = false, locksClosed = false } = status;

  return (
    <>
      <br />
      <br />

      <div className={styles['rooms-container']}>
        <header className={styles.header}>
          <h1>{room.name}</h1>
          <p>Manage your devices in the {room.name}</p>
        </header>

        <div className={styles['room-card']}>
          <h2>Room Status</h2>
          <div className={styles['room-status']}>
            <div className={styles['status-item']}>
              <FaTemperatureHigh className={styles['status-icon']} />
              <span>Temperature Inside</span>
              <span>{sensorData ? sensorData.temperature : 'N/A'}</span>  {/* Display temperature here */}
            </div>

            <div className={styles['status-item']}>
              <FaPowerOff className={styles['status-icon']} />
              <span>Power</span>
              <span className={powerOn ? styles.active : styles.inactive}>
                {powerOn ? 'On' : 'Off'}
              </span>
            </div>

            <div className={styles['status-item']}>
              <FaShieldAlt className={styles['status-icon']} />
              <span>Security</span>
              <span className={security ? styles.active : styles.inactive}>
                {security ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className={styles['additional-info']}>
              <p>{motionRecognition ? 'Motion recognition is active' : 'Motion recognition is inactive'}</p>
              <p>{locksClosed ? 'Locks are closed' : 'Locks are open'}</p>
            </div>
          </div>

          {/* Render the devices dynamically */}
          <div className={styles['device-list']}>
            <h3>Devices</h3>
            <ul>
              {['BeadRoom-Fans', 'BeadRoom-Lamps-Inside1', 'BeadRoom-Lamps-Inside2', 'BeadRoom-Wi-Fi'].map(
                (deviceKey) => (
                  <li key={deviceKey}>
                    <span>{deviceKey}</span> - {devices[deviceKey]?.checked ? 'On' : 'Off'}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rooms;
