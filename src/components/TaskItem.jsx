import { useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';

export default function TaskItem({ task, dispatch }) {
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const { showToast } = useToast();

  let dueLabel = '';
  let dueStatusClass = '';

  if (task.dueDate) {
    if (task.done) {
      dueLabel = 'Done';
      dueStatusClass = 'done';
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      if (task.dueDate < todayStr) {
        dueLabel = 'Overdue';
        dueStatusClass = 'overdue';
      } else if (task.dueDate === todayStr) {
        dueLabel = 'Due Today';
        dueStatusClass = 'today';
      } else {
        dueLabel = 'Upcoming';
        dueStatusClass = 'upcoming';
      }
    }
  }

  function handleToggle() {
    dispatch({ type: 'TOGGLE_TASK', payload: task.id });
    showToast(task.done ? 'Task marked as pending ⏳' : 'Task completed! 🎉', 'success');
  }

  function handleDelete() {
    dispatch({ type: 'DELETE_TASK', payload: task.id });
    showToast('Task deleted successfully! 🗑️', 'info');
  }

  function handleSaveEdit() {
    dispatch({ type: 'EDIT_TASK', payload: { id: task.id, title: draftTitle } });
    setEditing(false);
    showToast('Task title updated! 📝', 'success');
  }

  return (
    <li className={`task-item ${task.done ? 'task-item--done' : ''}`}>
      <input type="checkbox" checked={task.done} onChange={handleToggle} />

      {editing ? (
        <input
          className="task-item__edit-input"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
        />
      ) : (
        <span className="task-item__title">{task.title}</span>
      )}

      <span className={`task-item__priority task-item__priority--${task.priority}`}>
        {task.priority}
      </span>

      {task.dueDate && (
        <span className={`task-item__due-badge task-item__due-badge--${dueStatusClass}`}>
          📅 {dueLabel}: {task.dueDate}
        </span>
      )}

      {editing ? (
        <button onClick={handleSaveEdit}>Save</button>
      ) : (
        <button onClick={() => setEditing(true)}>Edit</button>
      )}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}
