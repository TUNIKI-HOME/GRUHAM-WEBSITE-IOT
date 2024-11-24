import React, { useState, useEffect } from 'react';
import { FaUserEdit } from 'react-icons/fa';
import styles from '../HomeCSS/Profile.module.css';
import { saveProfileToFirebase, getProfileFromFirebase } from '../Firebase/Firebase';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProfilePic from "../images/profile.png";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'sophie@sample.com',
    bio: 'About you',
    portfolioName: 'Upwork',
    portfolioLink: 'www.sophie.com',
    categories: {
      first: 'Legal',
      second: 'Tech & Internet',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const fetchedProfile = await getProfileFromFirebase();
        if (fetchedProfile) {
          setProfile(fetchedProfile);
        }
      } catch (error) {
        toast.error('Error fetching profile');
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveProfileToFirebase(profile);
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Error saving profile!');
    }
  };

  return (
    <>

      <div className={styles.container}>
        <h1 className={styles.title}>Edit Profile</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.profilePicContainer}>
            <img src={ProfilePic} alt="Profile" className={styles.profilePic} />
            <FaUserEdit className={styles.editIcon} />
          </div>
          <div className={styles.formGroup}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              rows="4"
            />
          </div>
          <div className={styles.formGroup}>
            <label>Portfolio Name</label>
            <input
              type="text"
              name="portfolioName"
              value={profile.portfolioName}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Portfolio Link</label>
            <input
              type="url"
              name="portfolioLink"
              value={profile.portfolioLink}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.saveButton}>Save Changes</button>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar newestOnTop />
    </>
  );
};

export default Profile;
