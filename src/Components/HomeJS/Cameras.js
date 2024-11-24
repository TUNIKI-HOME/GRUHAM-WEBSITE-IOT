import React from 'react';
import styles from '../HomeCSS/Cameras.module.css';

const Camera = () => {
    const cameraData = [
        { id: 1, section: '1st Floor', status: 'Closed', imgSrc: 'https://via.placeholder.com/400x300?text=Camera+1' },
        { id: 2, section: '2nd Floor (Courtyard)', status: 'Opened', imgSrc: 'https://via.placeholder.com/400x300?text=Camera+2' },
        { id: 3, section: '3rd Floor (Courtyard)', status: 'Opened', imgSrc: 'https://via.placeholder.com/400x300?text=Camera+3' },
        { id: 4, section: '4th Floor (Courtyard)', status: 'Opened', imgSrc: 'https://via.placeholder.com/400x300?text=Camera+4' },
    ];

    return (
        <>
    <br/>

        <div className={styles.cameraSystem}>
            <header className={styles.header}>
                <h1 className={styles.title}>Camera Security System</h1>
                <nav className={styles.nav}>
                    <button className={styles.navButton}>Sensors</button>
                    <button className={styles.navButton}>Cameras</button>
                </nav>
            </header>
            <div className={styles.cameraList}>
                {cameraData.map(camera => (
                    <div key={camera.id} className={`${styles.cameraCard} ${styles[camera.status.toLowerCase()]}`}>
                        <img src={camera.imgSrc} alt={`Camera view from ${camera.section}`} className={styles.cameraImage} />
                        <div className={styles.cameraInfo}>
                            <p className={styles.cameraSection}>Section: {camera.section}</p>
                            <p className={styles.cameraStatus}>Status: {camera.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default Camera;
