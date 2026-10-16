import { NavLink } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <UtensilsCrossed size={18} strokeWidth={2.2} className={styles.brandIcon} aria-hidden="true" />
          <span>
            Dine<span className={styles.accent}>Wise</span>
          </span>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <NavLink to="/"                className={styles.link}>Home</NavLink>
          <NavLink to="/recommendations" className={styles.link}>Recommendations</NavLink>
          <NavLink to="/analytics"       className={styles.link}>Analytics</NavLink>
        </nav>

        <p className={styles.copy}>
          © {year} DineWise · Bengaluru restaurant data
        </p>
      </div>
    </footer>
  );
}
