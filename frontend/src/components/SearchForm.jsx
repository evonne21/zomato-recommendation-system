import { useState, useEffect } from 'react';
import { Search, Utensils, AlertTriangle, Star } from 'lucide-react';
import { fetchCuisines, fetchRecommendations } from '../services/api.js';
import styles from './SearchForm.module.css';

const DEFAULT_FORM = {
  cuisine: '',
  max_budget: '',
  area: '',
  min_rating: '0',
  online_order: 'Any',
  top_n: '10',
};

export default function SearchForm({ onResults, onLoading, onError }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [cuisines, setCuisines] = useState([]);
  const [cuisinesError, setCuisinesError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  /* ── Load cuisines on mount ─────────────────────────────────────────────── */
  useEffect(() => {
    fetchCuisines()
      .then((data) => {
        setCuisines(data);
        if (data.length > 0) setForm((f) => ({ ...f, cuisine: data[0] }));
      })
      .catch(() => {
        setCuisinesError(
          'Could not load cuisines. Make sure the backend is running on port 5000.'
        );
      });
  }, []);

  /* ── Change handler ─────────────────────────────────────────────────────── */
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  /* ── Submit ─────────────────────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.cuisine || !form.max_budget) return;

    setSubmitting(true);
    onLoading(true);
    onError(null);

    try {
      const data = await fetchRecommendations(form);
      onResults(data);
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError && err.message.toLowerCase().includes('fetch');
      onError(
        isNetworkError
          ? 'Cannot reach the backend. Please ensure Flask is running on http://127.0.0.1:5000.'
          : err.message || 'An unexpected error occurred. Please try again.'
      );
      onResults(null);
    } finally {
      setSubmitting(false);
      onLoading(false);
    }
  }

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <h2 className={styles.heading}>
          <Search size={22} className={styles.headingIcon} aria-hidden="true" />
          <span>Find Your Perfect Restaurant</span>
        </h2>

        {cuisinesError && (
          <div className={styles.cuisinesError} role="alert">
            <AlertTriangle size={18} className={styles.alertIcon} aria-hidden="true" />
            <span>{cuisinesError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Cuisine */}
          <div className={styles.field}>
            <label htmlFor="cuisine" className={styles.label}>
              Cuisine Type <span className={styles.required}>*</span>
            </label>
            <select
              id="cuisine"
              name="cuisine"
              value={form.cuisine}
              onChange={handleChange}
              className={styles.select}
              required
              disabled={cuisines.length === 0}
            >
              {cuisines.length === 0 && (
                <option value="">Loading cuisines…</option>
              )}
              {cuisines.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Max budget */}
          <div className={styles.field}>
            <label htmlFor="max_budget" className={styles.label}>
              Max Budget for Two (₹) <span className={styles.required}>*</span>
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputPrefix}>₹</span>
              <input
                id="max_budget"
                name="max_budget"
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 800"
                value={form.max_budget}
                onChange={handleChange}
                className={`${styles.input} ${styles.inputWithPrefix}`}
                required
              />
            </div>
          </div>

          {/* Area */}
          <div className={styles.field}>
            <label htmlFor="area" className={styles.label}>
              Area / Locality{' '}
              <span className={styles.optional}>(optional)</span>
            </label>
            <input
              id="area"
              name="area"
              type="text"
              placeholder="e.g. Koramangala, Indiranagar…"
              value={form.area}
              onChange={handleChange}
              className={styles.input}
            />
          </div>

          {/* Min rating + Online order – side by side on wide screens */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="min_rating" className={styles.label}>
                Min Customer Rating
              </label>
              <div className={styles.ratingWrapper}>
                <input
                  id="min_rating"
                  name="min_rating"
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={form.min_rating}
                  onChange={handleChange}
                  className={styles.range}
                />
                <span className={styles.ratingBadge}>
                  <Star size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  <span>{Number(form.min_rating).toFixed(1)}</span>
                </span>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="online_order" className={styles.label}>
                Online Ordering
              </label>
              <div className={styles.toggleGroup} role="group" aria-label="Online ordering preference">
                {['Any', 'Yes', 'No'].map((opt) => (
                  <label
                    key={opt}
                    className={`${styles.toggleLabel} ${form.online_order === opt ? styles.toggleActive : ''}`}
                  >
                    <input
                      type="radio"
                      name="online_order"
                      value={opt}
                      checked={form.online_order === opt}
                      onChange={handleChange}
                      className={styles.toggleInput}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Number of results */}
          <div className={styles.field}>
            <label htmlFor="top_n" className={styles.label}>
              Number of Recommendations
            </label>
            <div className={styles.chipGroup} role="group" aria-label="Number of recommendations">
              {[5, 10, 15, 20].map((n) => (
                <label
                  key={n}
                  className={`${styles.chip} ${Number(form.top_n) === n ? styles.chipActive : ''}`}
                >
                  <input
                    type="radio"
                    name="top_n"
                    value={String(n)}
                    checked={Number(form.top_n) === n}
                    onChange={handleChange}
                    className={styles.chipInput}
                  />
                  {n}
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || !form.cuisine || !form.max_budget}
          >
            {submitting ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span>Searching…</span>
              </>
            ) : (
              <>
                <Utensils size={18} strokeWidth={2.2} aria-hidden="true" />
                <span>Find Restaurants</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
