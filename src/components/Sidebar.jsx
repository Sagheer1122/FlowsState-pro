const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'tasks', label: 'Tasks', icon: '✅' },
  { id: 'timer', label: 'Focus Timer', icon: '⏱️' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar({ activeTab, onChangeTab }) {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                className={activeTab === item.id ? 'nav-item nav-item--active' : 'nav-item'}
                onClick={() => onChangeTab(item.id)}
              >
                <span className="nav-item__icon">{item.icon}</span>
                <span className="nav-item__label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
