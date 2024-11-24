import React, { useState, useEffect } from 'react';
import styles from '../HomeCSS/Home.module.css';
import image1 from '../images/image1.png';
import image2 from '../images/image2.png';
import image3 from '../images/image3.png';
import Home2 from './Home2';

const images = [image1, image2, image3];

const Home = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
      <>
    <br/>

        <div className={styles.homeContainer}>
            <h1 className={styles.title}>Welcome to GRUHAM! </h1>
            <div className={styles.imageSlider}>
                <img 
                    src={images[currentIndex]} 
                    alt={`Slide ${currentIndex + 1}`} 
                    className={styles.slide} 
                />
            </div>
            <Home2 />
            <div className={styles.infoSection}>
                <spam>ABOUT GRUHAM</spam>
                <p>GRUHAM is an innovative home automation solution that integrates IoT technology to provide seamless control over your home environment. Using ESP32 microcontrollers, sensors, and relays, our system offers a user-friendly interface through React JS and Firebase to monitor and manage your smart devices efficiently.</p>
            </div>
        </div>
        </>
    );
};

export default Home;
