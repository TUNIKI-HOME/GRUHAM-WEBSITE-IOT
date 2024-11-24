// LedStrip.js
import React, { useState } from 'react';
import { CirclePicker } from 'react-color';
import styles from '../HomeCSS/Ledstrip.module.css';

const LedStrip = () => {
    const [color, setColor] = useState('#ffffff');
    const [intensity, setIntensity] = useState(72);
    const [centralLight, setCentralLight] = useState(true);
    const [saturation, setSaturation] = useState(100);
    const [lightness, setLightness] = useState(50);

    const handleColorChange = (color) => setColor(color.hex);
    const handleIntensityChange = (event) => setIntensity(event.target.value);
    const handleSaturationChange = (event) => setSaturation(event.target.value);
    const handleLightnessChange = (event) => setLightness(event.target.value);
    const toggleCentralLight = () => setCentralLight(!centralLight);

    return (
        <div className={styles.ledStripContainer}>
            <h1 className={styles.title}>LED Strip Control</h1>
            <div className={styles.colorControl}>
                <CirclePicker color={color} onChangeComplete={handleColorChange} />
                <div className={styles.sliders}>
                    <div className={styles.slider}>
                        <label>Saturation: {saturation}%</label>
                        <input type="range" min="0" max="100" value={saturation} onChange={handleSaturationChange} />
                    </div>
                    <div className={styles.slider}>
                        <label>Lightness: {lightness}%</label>
                        <input type="range" min="0" max="100" value={lightness} onChange={handleLightnessChange} />
                    </div>
                </div>
            </div>
            <div className={styles.intensityControl}>
                <label>Intensity: {intensity}%</label>
                <input type="range" min="0" max="100" value={intensity} onChange={handleIntensityChange} />
            </div>
            <div className={styles.centralLightToggle}>
                <label>Central Light</label>
                <input type="checkbox" checked={centralLight} onChange={toggleCentralLight} />
            </div>
            <div className={styles.modes}>
                <button className={`${styles.modeBtn} ${styles.customMode}`}>Custom</button>
                <button className={`${styles.modeBtn} ${styles.brightMode}`}>Bright</button>
                <button className={`${styles.modeBtn} ${styles.dimmedMode}`}>Dimmed</button>
                <button className={`${styles.modeBtn} ${styles.gradientMode}`}>Gradient</button>
            </div>
        </div>
    );
};

export default LedStrip;
