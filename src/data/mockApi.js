// Simulates a real backend with network delay.
let TASKS = [
  { id: 1, title: 'Design landing page', done: false, priority: 'high', category: 'Design' },
  { id: 2, title: 'Fix login bug', done: false, priority: 'high', category: 'Engineering' },
  { id: 3, title: 'Write onboarding docs', done: true, priority: 'low', category: 'Docs' },
  { id: 4, title: 'Set up CI pipeline', done: false, priority: 'medium', category: 'Engineering' },
  { id: 5, title: 'Client feedback call', done: false, priority: 'medium', category: 'Sales' },
  { id: 6, title: 'Refactor auth module', done: false, priority: 'high', category: 'Engineering' },
  { id: 7, title: 'Update pricing page copy', done: true, priority: 'low', category: 'Marketing' },
];

export function fetchTasks() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...TASKS]), 900);
  });
}

export function fetchUser(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: 'Sagheer', role: 'Product Engineer', tasksCompleted: 12 });
    }, 700);
  });
}

export function searchTasksRemote(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.toLowerCase();
      resolve(TASKS.filter((t) => t.title.toLowerCase().includes(q)));
    }, 500);
  });
}
