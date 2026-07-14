import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((text, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    
    // Automatically fade out and remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="assertive">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-item--${t.type}`}>
            <span className="toast-icon">
              {t.type === 'success' && '✅'}
              {t.type === 'error' && '❌'}
              {t.type === 'info' && 'ℹ️'}
              {t.type === 'warning' && '⚠️'}
            </span>
            <span className="toast-text">{t.text}</span>
            <button 
              className="toast-close" 
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
