# Answer Key — Do Not Open Until You've Tried

## 1. `src/components/TaskForm.jsx` — missing `preventDefault`
`handleSubmit` never calls `e.preventDefault()`, so the browser does a native
form submission and reloads the page. Fix: accept the event and call
`e.preventDefault()` at the top of the handler.

## 2. `src/components/TaskItem.jsx` — wrong reducer action type
`handleToggle` dispatches `{ type: 'TOGGLE_STATUS' }` but the reducer
(`src/reducers/taskReducer.js`) only handles `TOGGLE_TASK`. The reducer's
`default` case silently returns unchanged state. Fix: dispatch
`'TOGGLE_TASK'`. Lesson: action type strings are a contract — consider a
shared constants file/enum so typos become compile-time errors.

## 3 & 13. `src/components/Dashboard.jsx` — stale `useMemo`
`useMemo(() => {...}, [])` never recomputes because the dependency array is
empty, even though it reads `tasks`. Fix: `}, [tasks])`.

## 4. `src/components/UserProfile.jsx` — reading before data loads
`remoteUser` starts as `null` from `useFetch`, but the JSX reads
`remoteUser.role` unconditionally, throwing on first render. Fix: guard with
`loading` or optional chaining (`remoteUser?.role`) and a fallback.

## 5. `src/components/TaskList.jsx` — index as key
`<TaskItem key={index} .../>` uses the array index. When tasks are deleted or
filtered, React reuses DOM/state for the wrong item because the key no
longer maps to the same task. Fix: `key={task.id}`.

## 6. `src/context/AuthContext.jsx` — direct state mutation
`renameUser` does `user.name = newName` (mutating the existing object) before
calling `setUser(user)`. Since it's the *same* object reference, React can
skip re-rendering, or other consumers can read the mutated value
inconsistently before the render cycle. Fix:
`setUser(prev => ({ ...prev, name: newName }))`.

## 7. `src/hooks/useLocalStorage.js` — wrong effect dependencies
The effect that persists to `localStorage` has `[]` as its dependency array,
so it only ever writes the *initial* value once, on mount. Fix:
`}, [key, value])`.

## 8. `src/hooks/useDebounce.js` — missing cleanup
Every keystroke schedules a new `setTimeout`, but the effect never clears
the previous one, so multiple delayed updates can fire instead of just the
last one. Fix: `return () => clearTimeout(timer);`.

## 9 & 10. `src/hooks/useFetch.js` + `src/components/SearchBar.jsx` — race condition
Neither the generic `useFetch` hook nor `SearchBar`'s effect tracks whether
they're still the "current" request. A slow response for an old query can
resolve after a newer one and overwrite fresher state. Fix: use a mounted
flag or an AbortController, e.g.:
```js
useEffect(() => {
  let active = true;
  fetchFn().then((result) => { if (active) setData(result); });
  return () => { active = false; };
}, deps);
```

## 11. `src/context/ThemeContext.jsx` — unmemoized context value
`value = { theme, toggleTheme }` is a new object on every render of
`ThemeProvider`, so every consumer re-renders even when `theme` didn't
change. Fix: wrap in `useMemo(() => ({ theme, toggleTheme }), [theme])`
(and `toggleTheme` in `useCallback` if you want to be thorough).

## 12. `src/components/NotificationCenter.jsx` — missing listener cleanup
The `useEffect` adds `'online'`/`'offline'` listeners but returns nothing, so
they're never removed on unmount — a classic memory leak. Fix: return a
cleanup function calling `removeEventListener` for both.

## Bonus, more subtle: `src/components/PomodoroTimer.jsx` — stale closure
The `setInterval` callback closes over `secondsLeft` from the render when the
effect ran (only re-runs when `isRunning` changes), so it keeps recomputing
`secondsLeft - 1` from the *same* stale number every tick instead of
counting down properly. Fix: use the functional updater,
`setSecondsLeft(s => s - 1)`, which doesn't depend on the closed-over value.
