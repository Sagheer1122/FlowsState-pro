import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), priority, category, dueDate);
    setTitle('');
    setPriority('medium');
    setCategory('General');
    setDueDate('');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new task…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="task-form__input"
      />
      
      <div className="task-form__select-group">
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          className={`task-form__select task-form__select--priority-${priority}`}
          aria-label="Task Priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="task-form__select"
          aria-label="Task Category"
        >
          <option value="General">General</option>
          <option value="Engineering">Engineering</option>
          <option value="Design">Design</option>
          <option value="Docs">Docs</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
        </select>

        <input 
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)}
          className="task-form__date-input"
          aria-label="Task Due Date"
        />
      </div>

      <button type="submit" className="task-form__submit-btn">Add Task</button>
    </form>
  );
}
