import { UtensilsCrossed } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <UtensilsCrossed size={32} strokeWidth={2.2} className={styles.logoIcon} aria-hidden="true" />
          <span className={styles.logoText}>
            Dine<span className={styles.logoAccent}>Wise</span>
          </span>
        </div>
        <p className={styles.tagline}>
          Discover the best restaurants in Bengaluru tailored just for you
        </p>
      </div>
    </header>
  );
}
