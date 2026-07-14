export default function StatsCard({ label, value, className = '', ...props }) {
  return (
    <div className={`stats-card ${className}`} {...props}>
      <p className="stats-card__value">{value}</p>
      <p className="stats-card__label">{label}</p>
    </div>
  );
}
