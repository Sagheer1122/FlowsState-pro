import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import StatsCard from './StatsCard.jsx';

const DASHBOARD_QUOTES = [
  { text: "Life is 10% what happens to us and 90% how we react to it.", author: "Charles R. Swindoll", category: "Life" },
  { text: "I always wanted to be somebody, but now I realize I should have been more specific.", author: "Lily Tomlin", category: "Funny" },
  { text: "Your attitude, not your aptitude, will determine your altitude.", author: "Zig Ziglar", category: "Attitude" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa", category: "Love" },
  { text: "The only way to find true happiness is to be content with what you have.", author: "Unknown", category: "Happy" },
  { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo", category: "Sad" },
  { text: "Count your blessings, not your troubles. You are more blessed than you know.", author: "Unknown", category: "Blessed" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein", category: "Life" },
  { text: "People say nothing is impossible, but I do nothing every day.", author: "A. A. Milne", category: "Funny" },
  { text: "If you don't like something, change it. If you can't change it, change your attitude.", author: "Maya Angelou", category: "Attitude" },
  { text: "Where there is love there is life.", author: "Mahatma Gandhi", category: "Love" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle", category: "Happy" },
  { text: "Tears are words the heart can't express.", author: "Unknown", category: "Sad" },
  { text: "Blessed are they who see beautiful things in humble places where other people see nothing.", author: "Camille Pissarro", category: "Blessed" }
];

export default function Dashboard({ tasks = [] }) {
  const { user } = useAuth();

  const randomQuote = useMemo(() => {
    const idx = Math.floor(Math.random() * DASHBOARD_QUOTES.length);
    return DASHBOARD_QUOTES[idx];
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.done).length;
    const highPriority = tasks.filter((t) => t.priority === 'high').length;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const overdue = tasks.filter((t) => !t.done && t.dueDate && t.dueDate < todayStr).length;

    return { total, done, highPriority, pending: total - done, overdue };
  }, [tasks]);

  const completionRate = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  const urgentTasks = useMemo(() => {
    return tasks.filter((t) => t.priority === 'high' && !t.done).slice(0, 3);
  }, [tasks]);

  return (
    <section className="dashboard">
      <div className="dashboard__banner">
        <div className="dashboard__banner-content">
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>Ready to focus? You have <strong>{stats.pending}</strong> pending tasks today.</p>
        </div>
        <div className="dashboard__quote-card">
          <span className="quote-card__badge">{randomQuote.category}</span>
          <p className="quote-card__text">"{randomQuote.text}"</p>
          <p className="quote-card__author">— {randomQuote.author}</p>
        </div>
      </div>

      <div className="dashboard__grid">
        <StatsCard label="Total tasks" value={stats.total} />
        <StatsCard label="Completed" value={stats.done} />
        <StatsCard label="Pending" value={stats.pending} />
        <StatsCard label="High priority" value={stats.highPriority} />
        <StatsCard 
          label="Overdue tasks" 
          value={stats.overdue} 
          className={stats.overdue > 0 ? 'stats-card--overdue' : ''} 
        />
      </div>

      <div className="dashboard__row">
        <div className="dashboard__progress-card">
          <h3>Task Completion Rate</h3>
          <div className="progress-bar__outer">
            <div className="progress-bar__inner" style={{ width: `${completionRate}%` }}></div>
          </div>
          <p className="progress-bar__label">{completionRate}% of your tasks completed</p>
        </div>

        <div className="dashboard__urgent-tasks">
          <h3>Urgent Pending Tasks</h3>
          {urgentTasks.length > 0 ? (
            <ul className="urgent-tasks__list">
              {urgentTasks.map((task) => (
                <li key={task.id} className="urgent-tasks__item">
                  <span className="urgent-tasks__dot"></span>
                  <span className="urgent-tasks__title">{task.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="urgent-tasks__empty">All clear! No urgent pending tasks. 🎉</p>
          )}
        </div>
      </div>
    </section>
  );
}
