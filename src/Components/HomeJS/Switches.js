import React, { useState, useEffect } from 'react';
import { FaLightbulb, FaFan, FaWifi, FaPlug } from 'react-icons/fa'; // FaPlug is for socket
import ToggleSwitch from '../Toggleswitch/Toggleswitchs';  // Assuming you have this component
import styles from "../HomeCSS/Swiches.module.css";
import {
  saveDeviceStateToFirebase,
  fetchDeviceStateFromFirebase,
  listenToDeviceStateChanges,
  saveProfitData,
} from '../Firebase/Firebase';

const roomName = 'BeadRoom';  // Define the room name

// Device configuration for "Bead Room"
const devicesConfig = [
  { type: 'Tube-Light 1', id: 'BeadRoom-Lamps-Inside1', icon: <FaLightbulb /> },  // Tube-Light 1 icon
  { type: '3-Pin Socket', id: 'BeadRoom-Lamps-Inside2', icon: <FaPlug /> },       // 3-Pin Socket with switch icon
  { type: 'Fans', id: 'BeadRoom-Fans', icon: <FaFan /> },
  { type: 'Wi-Fi', id: 'BeadRoom-Wi-Fi', icon: <FaWifi /> },
];

const RoomSwitches = () => {
  const initialDeviceState = devicesConfig.reduce((acc, device) => {
    acc[device.id] = { checked: false };
    return acc;
  }, {});

  const [devices, setDevices] = useState(initialDeviceState);
  const [profitData, setProfitData] = useState(0);

  // Fetch initial device states and listen for real-time changes
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDeviceStateFromFirebase();
      if (data && data[roomName]?.devices) {
        const roomDevices = data[roomName].devices;
        const updatedDevices = {};
        devicesConfig.forEach(device => {
          updatedDevices[device.id] = { checked: roomDevices[device.id]?.checked || false };
        });
        setDevices(updatedDevices);
      }
    };

    fetchData();

    devicesConfig.forEach(device => {
      listenToDeviceStateChanges(roomName, device.id, (newState) => {
        setDevices(prevDevices => ({
          ...prevDevices,
          [device.id]: { checked: newState.checked },
        }));
      });
    });
  }, []);

  // Recalculate profitData every time the devices state changes
  useEffect(() => {
    const onCount = Object.values(devices).filter(device => device.checked).length;
    setProfitData(onCount);
    saveProfitData(roomName, onCount); // Save to Firebase
  }, [devices]); // Run this effect every time devices state changes

  const handleToggle = (deviceId) => {
    const updatedChecked = !devices[deviceId]?.checked;
    setDevices({
      ...devices,
      [deviceId]: { checked: updatedChecked },
    });

    saveDeviceStateToFirebase(roomName, deviceId, updatedChecked);
  };

  const handleTurnOffAllDevices = () => {
    const updatedDevices = Object.keys(devices).reduce((acc, key) => {
      acc[key] = { checked: false };
      return acc;
    }, {});
    setDevices(updatedDevices);

    devicesConfig.forEach(device => {
      saveDeviceStateToFirebase(roomName, device.id, false);
    });
  };

  return (
    <div className={styles.switchesContainer}>
      <header className={styles.header}>
        <h1>Bead Room Control Panel</h1>
        <p>Control and monitor devices in the Bead Room</p>
      </header>

      <div className={styles.devicesGrid}>
        {devicesConfig.map((device, i) => (
          <div key={i} className={styles.deviceCard}>
            <div className={styles.deviceInfo}>
              <div className={styles.deviceIcon}>{device.icon}</div>
              <span>{device.type}</span>
            </div>
            <div className={styles.deviceStatus}>
              <ToggleSwitch
                id={device.id}
                checked={devices[device.id]?.checked || false}
                onChange={() => handleToggle(device.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button className={styles.turnOffAll} onClick={handleTurnOffAllDevices}>
          Turn Off All Devices
        </button>
        <p>Devices On: {profitData}</p>
      </div>
    </div>
  );
};

export default RoomSwitches;
