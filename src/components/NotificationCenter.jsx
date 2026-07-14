import { useEffect } from 'react';
import { useToast } from '../context/ToastContext.jsx';

export default function NotificationCenter() {
  const { showToast } = useToast();

  useEffect(() => {
    function handleOffline() {
      showToast('You are offline. Changes will sync once reconnected.', 'warning');
    }
    function handleOnline() {
      showToast('Back online! Connected.', 'success');
    }

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [showToast]);

  return null;
}
