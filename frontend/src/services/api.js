import { API_BASE_URL } from '../config.js';

/**
 * Fetch all available cuisines from the backend.
 * @returns {Promise<string[]>}
 */
export async function fetchCuisines() {
  const res = await fetch(`${API_BASE_URL}/cuisines`);
  if (!res.ok) throw new Error(`Server error: ${res.status}`);
  return res.json();
}

/**
 * Fetch restaurant recommendations.
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
