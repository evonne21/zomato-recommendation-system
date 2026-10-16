import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Analytics from './pages/Analytics.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.app}>
      <Navbar />

      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Redirect /about to Home */}
          <Route path="/about" element={<Navigate to="/" replace />} />
          {/* Fallback – redirect unknown paths to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
