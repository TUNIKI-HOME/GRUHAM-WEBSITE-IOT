// Footer.js
import React from 'react';
import styles from '../HomeCSS/Fotter.module.css'; // Import the corrected CSS module

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.header}>
                <h5><spam>GRUHAM</spam></h5>
                <em><small>"GRUHAM Control, Anytime, Anywhere"</small></em>
            </div>
            <div className={styles.footerContent}>
                <ul className={styles.socials}>
                    <li><a href="#facebook" className={styles.socialLink}>facebook<i className="fab fa-facebook-f"></i></a></li>
                    <li><a href="#twitter" className={styles.socialLink}>twitter<i className="fab fa-twitter"></i></a></li>
                    <li><a href="#instagram" className={styles.socialLink}>instagram<i className="fab fa-instagram"></i></a></li>
                    <li><a href="#linkedin" className={styles.socialLink}>linkedin<i className="fab fa-linkedin-in"></i></a></li>
                    <li><a href="#GitHub" className={styles.socialLink}>GitHub<i className="fab fa-github"></i></a></li>
                </ul>
                <p>&copy; 2024 <spam>GRUHAM</spam>. All Rights Reserved.</p>
            </div>
        </footer>
    );
};


export default Footer;
