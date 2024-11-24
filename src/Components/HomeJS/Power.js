import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import styles from '../HomeCSS/Power.module.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const PowerSystem = () => {
  const [view, setView] = useState('Month');
  const [powerData, setPowerData] = useState({
    totalUsage: 0,
    usagePerRoom: { kitchen: 0, bathroom: 0, livingRoom: 0, orangeLivingRoom: 0 },
    usagePerDay: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
    usagePerWeek: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
    usagePerMonth: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
  });

  useEffect(() => {
    const fetchData = () => {
      const randomData = {
        totalUsage: Math.floor(Math.random() * 200),
        usagePerRoom: {
          kitchen: Math.floor(Math.random() * 50),
          bathroom: Math.floor(Math.random() * 20),
          livingRoom: Math.floor(Math.random() * 40),
          orangeLivingRoom: Math.floor(Math.random() * 30),
        },
        usagePerDay: Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)),
        usagePerWeek: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
        usagePerMonth: Array.from({ length: 7 }, () => Math.floor(Math.random() * 50)),
      };
      setPowerData(randomData);
    };
    fetchData();
  }, []);

  const { totalUsage, usagePerRoom, usagePerDay, usagePerWeek, usagePerMonth } = powerData;

  const data = {
    labels: view === 'Day' ? Array.from({ length: 24 }, (_, i) => `${i}:00`) :
            view === 'Week' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] :
            ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'kWh',
        data: view === 'Day' ? usagePerDay :
              view === 'Week' ? usagePerWeek :
              usagePerMonth,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
        borderRadius: 10,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: { backgroundColor: '#333', titleColor: '#fff', borderColor: '#00ff00' },
    },
  };

  return (
    <>
    <br/>
 
    <div className={styles.powerSystem}>
      <h1 className={styles.pageTitle}>Power Usage Dashboard</h1>
      <div className={styles.timeFrame}>
        <span onClick={() => setView('Day')} className={view === 'Day' ? styles.active : ''}>Day</span>
        <span onClick={() => setView('Week')} className={view === 'Week' ? styles.active : ''}>Week</span>
        <span onClick={() => setView('Month')} className={view === 'Month' ? styles.active : ''}>Month</span>
      </div>
      <div className={styles.totalUsage}>
        <h2>{totalUsage} kWh</h2>
        <p className={styles.usageChange}>22% Increase</p>
        <p className={styles.usageChangeValue}>12.54 kWh</p>
      </div>
      <div className={styles.chartContainer}>
        <Bar data={data} options={options} />
      </div>
      <div className={styles.usagePerRoom}>
        {Object.entries(usagePerRoom).map(([room, usage]) => (
          <div key={room} className={styles.roomUsage}>
            {room.charAt(0).toUpperCase() + room.slice(1)}: {usage} kWh
            <span className={styles.usagePercent}> ({((usage / totalUsage) * 100).toFixed(2)}%)</span>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default PowerSystem;
