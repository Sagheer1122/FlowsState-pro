import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce.js';
import { searchTasksRemote } from '../data/mockApi.js';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }
    let active = true;
    searchTasksRemote(debouncedQuery).then((data) => {
      if (active) {
        setResults(data);
      }
    });
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search tasks…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="search-bar__results">
          {results.map((r) => (
            <li key={r.id}>{r.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
