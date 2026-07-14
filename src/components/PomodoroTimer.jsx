import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';

const PRESETS = {
  focus: { label: '⚡ Focus', seconds: 25 * 60 },
  shortBreak: { label: '☕ Short Break', seconds: 5 * 60 },
  longBreak: { label: '🌴 Long Break', seconds: 15 * 60 }
};

export default function PomodoroTimer() {
  const [preset, setPreset] = useState('focus');
  const [secondsLeft, setSecondsLeft] = useState(PRESETS.focus.seconds);
  const [isRunning, setIsRunning] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  // Monitor timer completion
  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      showToast('Session completed! Time to take a break. ⏱️', 'success');
      
      // Attempt to play browser beep notify if available
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        oscillator.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // AudioContext browser blocked or unsupported
      }
    }
  }, [secondsLeft, isRunning, showToast]);

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(PRESETS[preset].seconds);
    showToast('Timer reset to preset duration', 'warning');
  }

  const handleToggleTimer = () => {
    setIsRunning((r) => {
      const next = !r;
      showToast(next ? 'Focus session started! ⚡' : 'Focus session paused ⏳', 'info');
      return next;
    });
  };

  const handlePresetChange = (key, config) => {
    setIsRunning(false);
    setPreset(key);
    setSecondsLeft(config.seconds);
    showToast(`Switched to preset: ${config.label}`, 'info');
  };

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <section className={`pomodoro pomodoro--preset-${preset}`}>
      <h2>Focus Timer</h2>

      <div className="pomodoro__presets">
        {Object.entries(PRESETS).map(([key, config]) => (
          <button
            key={key}
            className={`preset-btn ${preset === key ? 'preset-btn--active' : ''}`}
            onClick={() => handlePresetChange(key, config)}
          >
            {config.label}
          </button>
        ))}
      </div>

      <p className="pomodoro__clock">
        {minutes}:{seconds}
      </p>
      
      <div className="pomodoro__controls">
        <button onClick={handleToggleTimer}>{isRunning ? 'Pause' : 'Start'}</button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </section>
  );
}
