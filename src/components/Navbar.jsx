import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar__brand">✨ FlowState Pro</div>
      <div className="navbar__right">
        <span className="navbar__greeting">Hi, {user.name.toUpperCase()}</span>
        <button onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
}
