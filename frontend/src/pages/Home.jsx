import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Star,
  IndianRupee,
  Utensils,
  Search,
  ChartNoAxesCombined,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import heroRestaurantImg from '../assets/hero-restaurant.jpg';
import { fetchAnalytics } from '../services/api.js';
import styles from './Home.module.css';

/* ── Helpers ────────────────────────────────────────────────────────────── */

/** Format with Indian-locale commas. Returns '—' only for null / undefined. */
function fmt(n) {
  return n != null ? Number(n).toLocaleString('en-IN') : '—';
}

/** Format a rating to two decimal places, or '—' when unavailable. */
function fmtRating(n) {
  return n != null ? Number(n).toFixed(2) : '—';
}

/* ── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, loading, error }) {
  let display;
  if (loading) {
    display = <span className={styles.statSkeleton} aria-hidden="true" />;
  } else if (error) {
    display = <span className={styles.statUnavailable} title={error}>—</span>;
  } else {
    display = value;
  }

  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon} aria-hidden="true">
        <Icon size={22} strokeWidth={1.6} />
      </span>
      <div className={styles.statValue}>{display}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [analytics,  setAnalytics]  = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchAnalytics()
      .then((data) => { setAnalytics(data); setFetchError(null); })
      .catch((err) => { setAnalytics(null); setFetchError(err.message || 'Could not reach the backend.'); })
      .finally(() => setLoading(false));
  }, []);

  /* Derive the four stat values from real Flask field names */
  const totalRestaurants = analytics?.total_restaurants;
  const avgRating        = analytics?.average_rating;
  const medianCost       = analytics?.median_cost;
  const cuisineCount     = analytics?.cuisine_count;

  return (
    <div className={styles.page}>

      {/* ── Full-Width Photographic Hero ───────────────────────────────── */}
      <section className={styles.hero}>
        {/* Background image layer */}
        <div
          className={styles.heroBg}
          style={{ backgroundImage: `url(${heroRestaurantImg})` }}
          role="img"
          aria-label="Elegant restaurant dining room with warm pendant lighting, dark green walls, and leather booths"
        />
        {/* Dark overlay for text legibility */}
        <div className={styles.heroOverlay} aria-hidden="true" />

        {/* Centred content */}
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>BENGALURU RESTAURANT GUIDE</p>

          <h1 className={styles.heroHeading}>
            Find your next<br />
            <em className={styles.heroItalic}>favourite meal.</em>
          </h1>

          <p className={styles.heroBody}>
            Discover restaurants that match your taste, budget, and preferences.
          </p>

          <div className={styles.heroCta}>
            <Link to="/recommendations" className={styles.btnPrimary}>
              <Search size={17} strokeWidth={2} aria-hidden="true" />
              <span>Explore Restaurants</span>
            </Link>
            <Link to="/analytics" className={styles.btnSecondary}>
              <ChartNoAxesCombined size={17} strokeWidth={2} aria-hidden="true" />
              <span>Explore Analytics</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Dataset Statistics ─────────────────────────────────────── */}
      <section className={styles.statsSection} aria-live="polite">
        <div className={styles.statsInner}>
          <div className={styles.statsHeader}>
            <h2 className={styles.sectionTitle}>At a Glance</h2>
            <p className={styles.sectionSub}>
              Verified dataset metrics across Bengaluru dining establishments
            </p>
          </div>

          <div className={styles.statsGrid}>
            <StatCard
              icon={Store}
              label="Restaurants Analysed"
              value={fmt(totalRestaurants)}
              loading={loading}
              error={fetchError && '—'}
            />
            <StatCard
              icon={Star}
              label="Average Rating"
              value={fmtRating(avgRating)}
              loading={loading}
              error={fetchError && '—'}
            />
            <StatCard
              icon={IndianRupee}
              label="Median Cost for Two"
              value={medianCost != null ? `₹${fmt(medianCost)}` : '—'}
              loading={loading}
              error={fetchError && '—'}
            />
            <StatCard
              icon={Utensils}
              label="Cuisine Categories"
              value={fmt(cuisineCount)}
              loading={loading}
              error={fetchError && '—'}
            />
          </div>

          {/* Error notice */}
          {!loading && fetchError && (
            <p className={styles.statsNote} role="alert">
              <AlertCircle size={16} className={styles.alertIcon} aria-hidden="true" />
              <span>
                Could not load live statistics — make sure the Flask backend is
                running on <code>http://127.0.0.1:5000</code>.
              </span>
            </p>
          )}
        </div>
      </section>

      {/* ── How DineWise Works ──────────────────────────────────────────── */}
      <section className={styles.howSection}>
        <div className={styles.howInner}>
          <div className={styles.howHeader}>
            <h2 className={styles.sectionTitle}>How DineWise Works</h2>
            <p className={styles.sectionSub}>
              A weighted recommendation algorithm refined for discerning diners
            </p>
          </div>

          <div className={styles.steps}>
            {[
              {
                n: '01',
                title: 'Set your preferences',
                desc: 'Select preferred cuisine, define your budget, pick a neighbourhood, and choose a minimum rating requirement.',
              },
              {
                n: '02',
                title: 'Engine scores matches',
                desc: 'Our weighted-rating algorithm evaluates review volume and rating distributions to score qualifying restaurants.',
              },
              {
                n: '03',
                title: 'Explore your results',
                desc: 'Browse ranked recommendations with transparent pricing, locality details, and online ordering options.',
              },
            ].map(({ n, title, desc }) => (
              <div key={n} className={styles.step}>
                <div className={styles.stepNum} aria-hidden="true">{n}</div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{title}</h3>
                  <p  className={styles.stepDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.ctaRow}>
            <Link to="/recommendations" className={styles.btnCta}>
              <span>Discover Restaurants</span>
              <ChevronRight size={17} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
