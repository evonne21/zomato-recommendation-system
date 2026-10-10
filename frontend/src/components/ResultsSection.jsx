import RestaurantCard from './RestaurantCard.jsx';
import styles from './ResultsSection.module.css';

export default function ResultsSection({ results, loading, error }) {
  /* ── Loading skeleton ───────────────────────────────────────────────────── */
  if (loading) {
    return (
      <section className={styles.section} aria-live="polite" aria-busy="true">
        <div className={styles.loadingWrap}>
          <div className={styles.loadingSpinner} aria-hidden="true" />
          <p className={styles.loadingText}>Searching for the best restaurants…</p>
        </div>
        <div className={styles.skeletons}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} aria-hidden="true" />
          ))}
        </div>
      </section>
    );
  }

  /* ── Error ──────────────────────────────────────────────────────────────── */
  if (error) {
    return (
      <section className={styles.section} aria-live="polite">
        <div className={styles.errorBox} role="alert">
          <span className={styles.errorIcon} aria-hidden="true">⚠️</span>
          <div>
            <strong>Something went wrong</strong>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  /* ── No results ─────────────────────────────────────────────────────────── */
  if (results && results.count === 0) {
    return (
      <section className={styles.section} aria-live="polite">
        <div className={styles.emptyBox}>
          <span className={styles.emptyIcon} aria-hidden="true">🔍</span>
          <h3 className={styles.emptyTitle}>No restaurants found</h3>
          <p className={styles.emptyMsg}>
            Try broadening your search — increase the budget, lower the minimum
            rating, or remove the area filter.
          </p>
        </div>
      </section>
    );
  }

  /* ── Results ────────────────────────────────────────────────────────────── */
  if (results && results.count > 0) {
    return (
      <section className={styles.section} aria-live="polite">
        <div className={styles.resultsHeader}>
          <h2 className={styles.resultsTitle}>
            🎉 Found{' '}
            <span className={styles.count}>{results.count}</span>{' '}
            {results.count === 1 ? 'restaurant' : 'restaurants'}
          </h2>
          <p className={styles.resultsSub}>
            Sorted by best match &amp; number of reviews
          </p>
        </div>

        <div className={styles.grid}>
          {results.restaurants.map((r, i) => (
            <RestaurantCard
              key={`${r['restaurant name']}-${i}`}
              restaurant={r}
              index={i}
            />
          ))}
        </div>
      </section>
    );
  }

  /* ── Idle state (no search yet) ─────────────────────────────────────────── */
  return (
    <section className={styles.section}>
      <div className={styles.idleBox}>
        <span className={styles.idleIcon} aria-hidden="true">🍛</span>
        <p className={styles.idleText}>
          Fill in your preferences above and click{' '}
          <strong>Find Restaurants</strong> to discover great places to eat!
        </p>
      </div>
    </section>
  );
}
