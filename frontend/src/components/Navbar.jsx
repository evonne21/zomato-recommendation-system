import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { UtensilsCrossed, House, Search, ChartNoAxesCombined } from 'lucide-react';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: House, exact: true },
  { to: '/recommendations', label: 'Recommendations', icon: Search },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar} role="navigation" aria-label="Main navigation">
      <div className={styles.inner}>
        {/* Brand */}
        <NavLink to="/" className={styles.brand} aria-label="DineWise home">
          <UtensilsCrossed className={styles.brandIcon} size={26} strokeWidth={2.2} aria-hidden="true" />
          <span className={styles.brandName}>
            Dine<span className={styles.brandAccent}>Wise</span>
          </span>
        </NavLink>

        {/* Desktop links */}
        <ul className={styles.links} role="list">
          {NAV_LINKS.map(({ to, label, icon: Icon, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.linkActive : ''}`
                }
              >
                <Icon size={16} strokeWidth={2} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          type="button"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <ul className={styles.mobileMenu} role="list">
          {NAV_LINKS.map(({ to, label, icon: Icon, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
