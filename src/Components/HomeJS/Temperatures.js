import React, { useState, useEffect, useCallback } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from "../Firebase/Firebase"; // Import Firebase database
import styles from '../HomeCSS/Temperatures.module.css'; // Import styles for the components

// WeatherComponent: Fetches weather data from OpenWeatherMap API
const WeatherComponent = () => {
  const [city, setCity] = useState(''); // City input state
  const [weatherData, setWeatherData] = useState(null); // Weather data state
  const [loading, setLoading] = useState(false); // Loading state

  const apiKey = '5e5cb14ad2c45b7c41e011b4a367c447'; // OpenWeatherMap API key

  // Fetch weather data based on the entered city
  const fetchWeatherData = useCallback(() => {
    if (city) {
      setLoading(true);
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`; // Corrected URL
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setWeatherData(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          setLoading(false);
        });
    }
  }, [city, apiKey]);

  // Trigger data fetch when the city changes
  useEffect(() => {
    fetchWeatherData();
  }, [fetchWeatherData, city]);

  const handleInputChange = (event) => {
    setCity(event.target.value); // Update city name on input change
  };

  const handleSearch = () => {
    fetchWeatherData(); // Fetch weather data when user clicks search button
  };

  return (
    <div className={styles.weatherComponent}>
      <h2>Outside Weather</h2>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={city}
          onChange={handleInputChange}
          placeholder="Enter city name"
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>Search</button>
      </div>

      {loading ? (
        <div className={styles.loader}></div>
      ) : weatherData ? (
        <>
          <h3>Weather in {weatherData.name}</h3>
          <p>Temperature: {weatherData.main?.temp}°C</p>
          <p>Humidity: {weatherData.main?.humidity}%</p>
          {weatherData.weather && weatherData.weather.length > 0 && (
            <>
              <p>Condition: {weatherData.weather[0]?.description}</p>
              {weatherData.weather[0]?.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} // Correct URL with backticks
                  alt={weatherData.weather[0].description}
                  className={styles.weatherIcon}
                />
              )}
            </>
          )}
        </>
      ) : (
        <p>No weather data available</p>
      )}
    </div>
  );
};

// SensorData: Fetches sensor data (temperature, humidity) from Firebase
const SensorData = () => {
  const [sensorData, setSensorData] = useState(null); // Store sensor data here
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSensorDataFromFirebase = async () => {
      try {
        setLoading(true);
        const sensorRef = ref(database, 'users/FTuohQjo1mUCyaOuw24B9joHN9y1/rooms/BeadRoom/sensorData'); // Correct path to sensor data with backticks
        onValue(sensorRef, (snapshot) => {
          const data = snapshot.val();
          if (data && data.temperature !== undefined && data.humidity !== undefined) {
            setSensorData({
              temperature: data.temperature || 0,
              humidity: data.humidity || 0,
            });
          } else {
            setSensorData({ temperature: 0, humidity: 0 });
          }
        });
      } catch (error) {
        setError("Failed to fetch sensor data from Firebase.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorDataFromFirebase(); // Fetch data for 'BeadRoom'

    // Cleanup listener when component unmounts
    return () => setSensorData(null); // Cleanup function
  }, []);

  return (
    <div className={styles.firebaseComponent}>
      <h2>Room Weather</h2>
      {loading ? (
        <div className={styles.loader}></div> // Show loader while fetching data
      ) : error ? (
        <p>{error}</p>
      ) : sensorData ? (
        <>
          <p>Temperature: {sensorData.temperature}°C</p> {/* Display temperature from Firebase */}
          <p>Humidity: {sensorData.humidity}%</p> {/* Display humidity from Firebase */}
        </>
      ) : (
        <p>No sensor data available</p>
      )}
    </div>
  );
};

// Temperature Page: Displays both WeatherComponent and SensorData components
const Temperature = () => {
  return (
    <div className={styles.temperaturePage}>
      <div className={styles.mainContent}>
        <WeatherComponent /> {/* Display outside weather */}
        <SensorData /> {/* Display room sensor data */}
      </div>
    </div>
  );
};

export default Temperature;
