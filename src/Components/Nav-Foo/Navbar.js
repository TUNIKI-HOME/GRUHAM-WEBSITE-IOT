import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase";
import { signOut } from "firebase/auth";
import styles from "../HomeCSS/Navbar.module.css";
import logoImage from "../images/imagelog.png";
import profileImage from "../images/profile.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle Sign-Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signinup");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Toggle mobile menu
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className={`${styles.navbar} ${menuOpen ? styles.menuOpen : ""}`}>
      {/* Logo */}
      <div className={styles.navbarLogo}>
        <Link to="/home">
          <img src={logoImage} alt="Logo" className={styles.logo} />
        </Link>
      </div>

      {/* Navbar Links */}
      <div className={`${styles.navLinksWrapper} ${menuOpen ? styles.showMenu : ""}`}>
        <ul className={styles.navbarLinks}>
          <li><Link to="/home" className={styles.navLink}>Home</Link></li>
          <li><Link to="/switches" className={styles.navLink}>Switches</Link></li>
          <li><Link to="/led" className={styles.navLink}>Led Strip</Link></li>
          {/* Dropdown */}
          <li className={styles.navDropdown}>
            <button className={styles.dropdownToggle}>Devices</button>
            <div className={styles.dropdownMenu}>
              <Link to="/rooms" className={styles.dropdownItem}>Rooms</Link>
              <Link to="/temperature" className={styles.dropdownItem}>Temperatures</Link>
              <Link to="/camera" className={styles.dropdownItem}>Cameras</Link>
              <Link to="/power" className={styles.dropdownItem}>Power</Link>
            </div>
          </li>
        </ul>
      </div>

      {/* Profile and Sign-Out Section */}
      <div className={styles.profileAndSignIn}>
        <Link to="/profile" className={styles.profileButton}>
          <img src={profileImage} alt="Profile" className={styles.profileImage} />
        </Link>
        <button onClick={handleSignOut} className={styles.signOutButton}>Sign Out</button>
      </div>

      {/* Mobile Menu Toggle */}
      <div className={styles.mobileMenuToggle} onClick={toggleMenu}>
        <span className={styles.bar}> </span>
        <span className={styles.bar}> </span>
        <span className={styles.bar}> </span>
      </div>
    </nav>
  );
};

export default Navbar;
