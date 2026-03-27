import { useEffect, useRef } from 'react';

const AUTO_LOGOUT_TIME = 10 * 60 * 1000; // 10 minutes

export const useAutoLogout = (logout: () => void) => {
  const timerRef = useRef<any>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      // Show warning or logout directly
      alert('Session expired due to inactivity');
      logout();
    }, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => resetTimer();

    events.forEach(event => window.addEventListener(event, handleActivity));
    resetTimer();

    return () => {
      events.forEach(event => window.removeEventListener(event, handleActivity));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return resetTimer;
};
