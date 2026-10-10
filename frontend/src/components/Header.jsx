import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <span className={styles.logoIcon} aria-hidden="true">🍽️</span>
          <span className={styles.logoText}>
            Zomato <span className={styles.logoAccent}>Finder</span>
          </span>
        </div>
        <p className={styles.tagline}>
          Discover the best restaurants in Bengaluru tailored just for you
        </p>
      </div>
    </header>
  );
}
