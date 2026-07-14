export const initialTaskState = {
  tasks: [],
  filter: 'all', // all | active | completed
};

export function taskReducer(state, action) {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload ? { ...t, done: !t.done } : t
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case 'EDIT_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...t, title: action.payload.title } : t
        ),
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    default:
      return state;
  }
}
