import TaskItem from './TaskItem.jsx';
import TaskForm from './TaskForm.jsx';
import FilterBar from './FilterBar.jsx';
import SearchBar from './SearchBar.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function TaskList({ state, dispatch }) {
  const { showToast } = useToast();

  const visibleTasks = state.tasks.filter((t) => {
    if (state.filter === 'active') return !t.done;
    if (state.filter === 'completed') return t.done;
    return true;
  });

  function handleAddTask(title, priority, category, dueDate) {
    dispatch({
      type: 'ADD_TASK',
      payload: { id: Date.now(), title, done: false, priority, category, dueDate },
    });
    showToast('Task added successfully! 📋', 'success');
  }

  return (
    <section className="task-list">
      <h2>Tasks</h2>
      <TaskForm onAdd={handleAddTask} />
      <SearchBar />
      <FilterBar currentFilter={state.filter} onChangeFilter={(f) => dispatch({ type: 'SET_FILTER', payload: f })} />

      <ul className="task-list__items">
        {visibleTasks.map((task) => (
          <TaskItem key={task.id} task={task} dispatch={dispatch} />
        ))}
      </ul>
    </section>
  );
}
