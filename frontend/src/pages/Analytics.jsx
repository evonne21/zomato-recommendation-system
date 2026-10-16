import { useState, useEffect, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  ChartNoAxesCombined,
  Store,
  Star,
  IndianRupee,
  Utensils,
  UtensilsCrossed,
  AlertCircle,
  RotateCw,
} from 'lucide-react';
import { fetchAnalytics } from '../services/api.js';
import styles from './Analytics.module.css';

/* ── Per-chart colour assignments (per spec) ─────────────────────────── */
const C_RATING_DIST  = '#965666';  /* Rating distribution  */
const C_COST_DIST    = '#6686A3';  /* Cost distribution    */
const C_SCATTER      = '#9582AD';  /* Rating vs Cost       */
const C_ONLINE_YES   = '#5D9690';  /* Online ordering Yes  */
const C_ONLINE_NO    = '#A09992';  /* Online ordering No   */
const C_BOOKING_YES  = '#C6A45C';  /* Table booking Yes    */
const C_BOOKING_NO   = '#A09992';  /* Table booking No     */

/* Top-10 cuisines – distinguishable multi-hue palette */
const CUISINE_PALETTE = [
  '#829477', '#965666', '#6686A3', '#C6A45C', '#9582AD',
  '#5D9690', '#A07060', '#7A8FA6', '#8C7A55', '#617A6E',
];

const CHART_GRID = '#EAE8E5';
const CHART_TEXT = '#77716C';

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  borderColor: '#E5DED5',
  borderRadius: 8,
  boxShadow: '0 4px 14px rgba(48, 43, 41, 0.08)',
  color: '#302B29',
  fontSize: '0.85rem',
};

/* ── Number / Currency Formatters ─────────────────────────────────────── */
function formatRupees(val) {
  if (val == null || isNaN(val)) return '—';
  return `₹${Number(val).toLocaleString('en-IN')}`;
}

function formatCount(val) {
  if (val == null || isNaN(val)) return '—';
  return Number(val).toLocaleString('en-IN');
}

function formatRating(val) {
  if (val == null || isNaN(val)) return '—';
  return Number(val).toFixed(2);
}

/* ── Summary Stat Card ────────────────────────────────────────────────── */
function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className={styles.summaryCard}>
      <span className={styles.summaryIcon} aria-hidden="true">
        <Icon size={24} strokeWidth={1.8} />
      </span>
      <div className={styles.summaryValue}>{value}</div>
      <div className={styles.summaryLabel}>{label}</div>
    </div>
  );
}

/* ── Reusable Chart Card Wrapper ─────────────────────────────────────── */
function ChartCard({ title, subtitle, explanation, children }) {
  return (
    <div className={styles.chartCard}>
      <div className={styles.chartCardHeader}>
        <h3 className={styles.chartTitle}>{title}</h3>
        {subtitle && <p className={styles.chartSub}>{subtitle}</p>}
      </div>
      <div className={styles.chartBody}>{children}</div>
      {explanation && (
        <p className={styles.chartExplanation}>{explanation}</p>
      )}
    </div>
  );
}

/* ── Error / Not Connected Notice ─────────────────────────────────────── */
function ErrorNotice({ error, onRetry }) {
  return (
    <div className={styles.notConnected} role="alert">
      <AlertCircle size={40} strokeWidth={1.8} className={styles.notConnectedIcon} aria-hidden="true" />
      <h3>Unable to load analytics</h3>
      <p>
        Could not retrieve analytics data from the backend. Please ensure the Flask
        API server is running on <code>http://127.0.0.1:5000</code>.
      </p>
      {error && <p className={styles.errorDetail}>{error}</p>}
      {onRetry && (
        <button onClick={onRetry} className={styles.retryBtn} type="button">
          <RotateCw size={14} strokeWidth={2.2} aria-hidden="true" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}

/* ── Loading Skeleton ─────────────────────────────────────────────────── */
function LoadingSkeleton() {
  return (
    <div className={styles.skeletonGrid} aria-label="Loading analytics charts">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeleton} aria-hidden="true" />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function Analytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAnalytics()
      .then((res) => { setData(res); setError(null); })
      .catch((err) => { setError(err.message || 'Failed to fetch analytics.'); setData(null); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const isEmpty = !loading && data && data.total_restaurants === 0;

  return (
    <div className={styles.page}>
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <section className={styles.pageHero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroHeading}>
            <ChartNoAxesCombined size={26} strokeWidth={2} className={styles.heroIcon} aria-hidden="true" />
            <span>Analytics Dashboard</span>
          </h1>
          <p className={styles.heroSub}>
            Real-time statistics and dataset insights from cleaned Bengaluru restaurant data.
          </p>
        </div>
      </section>

      <div className={styles.content}>
        {/* Loading */}
        {loading && (
          <div className={styles.loadingWrap} aria-live="polite" aria-busy="true">
            <div className={styles.spinner} aria-hidden="true" />
            <p>Loading analytics data from backend…</p>
            <LoadingSkeleton />
          </div>
        )}

        {/* Error */}
        {!loading && (error || !data) && (
          <ErrorNotice error={error} onRetry={loadData} />
        )}

        {/* Empty */}
        {isEmpty && (
          <div className={styles.emptyNotice} role="status">
            <UtensilsCrossed size={40} strokeWidth={1.6} className={styles.emptyIcon} aria-hidden="true" />
            <h3>No restaurant data available</h3>
            <p>The dataset currently contains no records to analyze.</p>
          </div>
        )}

        {/* Dashboard */}
        {!loading && data && !isEmpty && (
          <>
            {/* Summary Cards */}
            <div className={styles.summaryRow}>
              <SummaryCard icon={Store}       label="Restaurants Analysed"  value={formatCount(data.total_restaurants)} />
              <SummaryCard icon={Star}        label="Average Rating"        value={formatRating(data.average_rating)} />
              <SummaryCard icon={IndianRupee} label="Median Cost for Two"   value={formatRupees(data.median_cost)} />
              <SummaryCard icon={Utensils}    label="Cuisine Categories"    value={formatCount(data.cuisine_count)} />
            </div>

            {/* Charts Grid */}
            <div className={styles.grid}>

              {/* 1. Rating Distribution */}
              {Array.isArray(data.rating_distribution) && data.rating_distribution.length > 0 && (
                <ChartCard
                  title="Restaurant Rating Distribution"
                  subtitle="Frequency of restaurants across customer rating intervals"
                  explanation="Displays the distribution of restaurant ratings across 7 defined score intervals, showing how scores range from lowest to highest across the city."
                >
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.rating_distribution} margin={{ top: 16, right: 16, left: 16, bottom: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                      <XAxis
                        dataKey="range"
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        angle={-20}
                        textAnchor="end"
                        height={45}
                        label={{ value: 'Rating Range', position: 'insideBottom', offset: -12, fontSize: 12, fill: CHART_TEXT }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        label={{ value: 'Restaurant Count', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: CHART_TEXT }}
                      />
                      <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(val) => [`${formatCount(val)} restaurants`, 'Count']}
                        labelFormatter={(lbl) => `Rating: ${lbl}`}
                      />
                      <Bar dataKey="count" fill={C_RATING_DIST} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* 2. Cost Distribution */}
              {Array.isArray(data.cost_distribution) && data.cost_distribution.length > 0 && (
                <ChartCard
                  title="Cost Distribution for Two"
                  subtitle="Frequency of restaurants across estimated cost tiers"
                  explanation="Shows the number of restaurants grouped into average price ranges for two diners in Indian rupees."
                >
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data.cost_distribution} margin={{ top: 16, right: 16, left: 16, bottom: 28 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                      <XAxis
                        dataKey="range"
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        angle={-25}
                        textAnchor="end"
                        height={50}
                        label={{ value: 'Cost Range (₹)', position: 'insideBottom', offset: -14, fontSize: 12, fill: CHART_TEXT }}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        label={{ value: 'Restaurant Count', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: CHART_TEXT }}
                      />
                      <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(val) => [`${formatCount(val)} restaurants`, 'Count']}
                        labelFormatter={(lbl) => `Cost: ${lbl}`}
                      />
                      <Bar dataKey="count" fill={C_COST_DIST} radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* 3. Top 10 Cuisines — horizontal bar */}
              {Array.isArray(data.top_cuisines) && data.top_cuisines.length > 0 && (
                <ChartCard
                  title="Top 10 Cuisines"
                  subtitle="Most frequently listed cuisines by restaurant count"
                  explanation="Ranks the ten most common cuisine types across restaurant listings in Bengaluru, based on total occurrences in the dataset."
                >
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={data.top_cuisines} layout="vertical" margin={{ top: 8, right: 24, left: 16, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        label={{ value: 'Restaurant Count', position: 'insideBottom', offset: -10, fontSize: 12, fill: CHART_TEXT }}
                        height={40}
                      />
                      <YAxis
                        type="category"
                        dataKey="cuisine"
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        width={95}
                      />
                      <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(val) => [`${formatCount(val)} listings`, 'Count']}
                        labelFormatter={(lbl) => `Cuisine: ${lbl}`}
                      />
                      <Bar dataKey="count" radius={[0, 3, 3, 0]}>
                        {data.top_cuisines.map((_, i) => (
                          <Cell key={i} fill={CUISINE_PALETTE[i % CUISINE_PALETTE.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* 4. Rating vs Cost — scatter */}
              {Array.isArray(data.rating_vs_cost) && data.rating_vs_cost.length > 0 && (
                <ChartCard
                  title="Rating versus Cost"
                  subtitle="Scatter plot of customer rating against cost for two people"
                  explanation="Plots individual restaurant average ratings against estimated dining costs for two people, illustrating the spread across diverse price points."
                >
                  <ResponsiveContainer width="100%" height={320}>
                    <ScatterChart margin={{ top: 16, right: 24, left: 24, bottom: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                      <XAxis
                        dataKey="rating"
                        name="Rating"
                        type="number"
                        domain={[1, 5]}
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        label={{ value: 'Customer Rating (out of 5)', position: 'insideBottom', offset: -10, fontSize: 12, fill: CHART_TEXT }}
                        height={45}
                      />
                      <YAxis
                        dataKey="cost"
                        name="Cost"
                        type="number"
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        tickFormatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`}
                        label={{ value: 'Cost for Two (₹)', angle: -90, position: 'insideLeft', offset: -5, fontSize: 12, fill: CHART_TEXT }}
                        width={75}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: '3 3', stroke: CHART_TEXT }}
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(val, name) => {
                          if (name === 'Cost')   return [formatRupees(val), 'Cost for Two'];
                          if (name === 'Rating') return [`${Number(val).toFixed(1)} / 5`, 'Customer Rating'];
                          return [val, name];
                        }}
                      />
                      <Scatter data={data.rating_vs_cost} fill={C_SCATTER} fillOpacity={0.55} />
                    </ScatterChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* 5. Online Ordering */}
              {Array.isArray(data.online_ordering) && data.online_ordering.length > 0 && (
                <ChartCard
                  title="Online Ordering Availability"
                  subtitle="Comparison of restaurants offering online food delivery"
                  explanation="Compares the count of restaurants that support online ordering on Zomato against those that offer dine-in or takeaway only."
                >
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.online_ordering} margin={{ top: 16, right: 20, left: 16, bottom: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12, fill: CHART_TEXT }}
                        label={{ value: 'Online Ordering Option', position: 'insideBottom', offset: -10, fontSize: 12, fill: CHART_TEXT }}
                        height={40}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        label={{ value: 'Restaurant Count', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: CHART_TEXT }}
                      />
                      <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(val) => [`${formatCount(val)} restaurants`, 'Count']}
                        labelFormatter={(lbl) => `Online Ordering: ${lbl}`}
                      />
                      <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                        {data.online_ordering.map((entry, idx) => (
                          <Cell key={idx} fill={entry.category === 'Yes' ? C_ONLINE_YES : C_ONLINE_NO} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

              {/* 6. Table Booking */}
              {Array.isArray(data.table_booking) && data.table_booking.length > 0 && (
                <ChartCard
                  title="Table Booking Availability"
                  subtitle="Comparison of restaurants offering table reservations"
                  explanation="Compares the count of restaurants that support advance table reservations against those operating without reservation booking."
                >
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.table_booking} margin={{ top: 16, right: 20, left: 16, bottom: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12, fill: CHART_TEXT }}
                        label={{ value: 'Table Booking Option', position: 'insideBottom', offset: -10, fontSize: 12, fill: CHART_TEXT }}
                        height={40}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: CHART_TEXT }}
                        label={{ value: 'Restaurant Count', angle: -90, position: 'insideLeft', offset: 0, fontSize: 12, fill: CHART_TEXT }}
                      />
                      <Tooltip
                        contentStyle={TOOLTIP_STYLE}
                        formatter={(val) => [`${formatCount(val)} restaurants`, 'Count']}
                        labelFormatter={(lbl) => `Table Booking: ${lbl}`}
                      />
                      <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                        {data.table_booking.map((entry, idx) => (
                          <Cell key={idx} fill={entry.category === 'Yes' ? C_BOOKING_YES : C_BOOKING_NO} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              )}

            </div>
          </>
        )}
      </div>
    </div>
  );
}
