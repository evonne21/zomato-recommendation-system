import { useState } from 'react';
import Header        from './components/Header.jsx';
import SearchForm    from './components/SearchForm.jsx';
import ResultsSection from './components/ResultsSection.jsx';
import Footer        from './components/Footer.jsx';
import styles        from './App.module.css';

export default function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  return (
    <div className={styles.app}>
      <Header />

      <main className={styles.main}>
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
      </main>

      <Footer />
    </div>
  );
}
