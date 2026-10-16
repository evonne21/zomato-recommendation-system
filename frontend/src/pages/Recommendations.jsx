import { useState } from 'react';
import { Search } from 'lucide-react';
import SearchForm     from '../components/SearchForm.jsx';
import ResultsSection from '../components/ResultsSection.jsx';
import styles from './Recommendations.module.css';

export default function Recommendations() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  return (
    <div className={styles.page}>
      {/* Page hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroHeading}>
            <Search size={28} strokeWidth={2.4} className={styles.heroIcon} aria-hidden="true" />
            <span>Restaurant Recommendations</span>
          </h1>
          <p className={styles.heroSub}>
            Tailor your search by cuisine, budget, area, and rating to find
            the perfect restaurant for any occasion.
          </p>
        </div>
      </section>

      {/* Form + results (existing components, unchanged) */}
      <div className={styles.content}>
        <SearchForm
          onResults={setResults}
          onLoading={setLoading}
          onError={setError}
        />
        <ResultsSection
          results={results}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
