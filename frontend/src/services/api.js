import { API_BASE_URL } from '../config.js';

/**
 * Fetch all available cuisines from the backend.
 * GET /cuisines
 * @returns {Promise<string[]>}
 */
export async function fetchCuisines() {
  const res = await fetch(`${API_BASE_URL}/cuisines`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

/**
 * Fetch restaurant recommendations.
 * POST /recommend
 * @param {Object} params
 * @param {string}      params.cuisine
 * @param {number}      params.max_budget
 * @param {string}      params.area
 * @param {number}      params.min_rating
 * @param {string|null} params.online_order  – "Yes" | "No" | null
 * @param {number}      params.top_n
 * @returns {Promise<{ count: number, restaurants: Object[] }>}
 */
export async function fetchRecommendations({
  cuisine,
  max_budget,
  area,
  min_rating,
  online_order,
  top_n,
}) {
  const res = await fetch(`${API_BASE_URL}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cuisine,
      max_budget: Number(max_budget),
      area: area || '',
      min_rating: Number(min_rating),
      online_order: online_order === 'Any' ? null : online_order,
      top_n: Number(top_n),
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Server error: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch analytics data from the backend.
 * GET /analytics
 *
 * Actual response shape from Flask:
 * {
 *   total_restaurants   : number,
 *   average_rating      : number | null,
 *   median_cost         : number | null,
 *   cuisine_count       : number,
 *   imputed_ratings     : number,
 *   rating_distribution : [{ range: string, count: number }],
 *   cost_distribution   : [{ range: string, count: number }],
 *   top_cuisines        : [{ cuisine: string, count: number }],
 *   online_ordering     : [{ category: string, count: number }],
 *   table_booking       : [{ category: string, count: number }],
 *   rating_vs_cost      : [{ rating: number, cost: number }],
 * }
 * @returns {Promise<Object>}
 */
export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE_URL}/analytics`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}
