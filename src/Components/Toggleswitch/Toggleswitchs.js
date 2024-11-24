import React from 'react';
import styles from '../HomeCSS/Toggleswitch.module.css';

const ToggleSwitch = ({ id, checked, onChange }) => {
    return (
        <div className={styles['toggle-switch']}>
            <input
                type="checkbox"
                className={styles['toggle-switch-checkbox']}
                id={`toggle-switch-${id}`}
                checked={checked}
                onChange={onChange}
            />
            <label className={styles['toggle-switch-label']} htmlFor={`toggle-switch-${id}`}>
                <span className={styles['toggle-switch-inner']} />
                <span className={styles['toggle-switch-switch']} />
            </label>
        </div>
    );
};

export default ToggleSwitch;
