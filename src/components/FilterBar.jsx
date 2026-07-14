const FILTERS = ['all', 'active', 'completed'];

export default function FilterBar({ currentFilter, onChangeFilter }) {
  return (
    <div className="filter-bar">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={currentFilter === f ? 'filter-btn filter-btn--active' : 'filter-btn'}
          onClick={() => onChangeFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
