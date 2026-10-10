import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        <span aria-hidden="true">🍽️</span>{' '}
        Zomato Restaurant Finder &mdash; Powered by real Bengaluru restaurant data
      </p>
    </footer>
  );
}
