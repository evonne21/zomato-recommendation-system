import styles from './RestaurantCard.module.css';

/**
 * Maps a numeric rating to a star display string.
 */
function stars(rating) {
  const full = Math.round(rating * 2) / 2;   // nearest 0.5
  const filled = Math.floor(full);
  const half   = full % 1 !== 0 ? 1 : 0;
  const empty  = 5 - filled - half;
  return '★'.repeat(filled) + (half ? '½' : '') + '☆'.repeat(empty);
}

/**
 * Maps a rating number to a colour class.
 */
function ratingClass(rating) {
  if (rating >= 4.5) return styles.excellent;
  if (rating >= 4.0) return styles.great;
  if (rating >= 3.5) return styles.good;
  if (rating >= 3.0) return styles.average;
  return styles.below;
}

export default function RestaurantCard({ restaurant, index }) {
  const name        = restaurant['restaurant name'] ?? 'Unknown Restaurant';
  const cuisine     = restaurant['cuisines type']    ?? '—';
  const rating      = restaurant['rate (out of 5)'];
  const cost        = restaurant['avg cost (two people)'];
  const area        = restaurant['area']             ?? '—';
  const onlineOrder = restaurant['online_order'];

  const hasRating  = rating !== null && rating !== undefined;
  const ratingNum  = hasRating ? Number(rating) : null;

  return (
    <article className={styles.card} style={{ '--delay': `${index * 60}ms` }}>
      {/* Rank badge */}
      <div className={styles.rank} aria-label={`Rank ${index + 1}`}>
        #{index + 1}
      </div>

      {/* Card body */}
      <div className={styles.body}>
        <h3 className={styles.name} title={name}>{name}</h3>

        <p className={styles.cuisine}>
          <span aria-hidden="true">🍴</span> {cuisine}
        </p>

        <div className={styles.meta}>
          {/* Rating */}
          <div className={`${styles.ratingBadge} ${hasRating ? ratingClass(ratingNum) : styles.noRating}`}>
            {hasRating ? (
              <>
                <span className={styles.ratingNum}>{ratingNum.toFixed(1)}</span>
                <span className={styles.ratingOf}>/5</span>
                <span className={styles.stars} aria-hidden="true">{stars(ratingNum)}</span>
              </>
            ) : (
              <span className={styles.noRatingText}>No rating</span>
            )}
          </div>

          {/* Cost */}
          <div className={styles.infoPill}>
            <span aria-hidden="true">💰</span>
            <span>
              {cost !== null && cost !== undefined
                ? `₹${Number(cost).toLocaleString('en-IN')} for two`
                : 'Cost N/A'}
            </span>
          </div>

          {/* Area */}
          <div className={styles.infoPill}>
            <span aria-hidden="true">📍</span>
            <span>{area}</span>
          </div>

          {/* Online order */}
          <div className={`${styles.orderBadge} ${onlineOrder === 'Yes' ? styles.orderYes : styles.orderNo}`}>
            <span aria-hidden="true">{onlineOrder === 'Yes' ? '🛵' : '🏪'}</span>
            <span>{onlineOrder === 'Yes' ? 'Online Order' : 'Dine-in Only'}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
