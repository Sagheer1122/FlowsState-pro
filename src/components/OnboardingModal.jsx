import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function OnboardingModal() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState('Product Engineer');

  // If name is already set in localStorage / AuthContext, hide modal
  if (user.name) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!nameInput.trim()) return;

    updateProfile({
      name: nameInput.trim(),
      role: roleInput.trim(),
      email: `${nameInput.trim().toLowerCase().replace(/\s+/g, '')}@flowstate.pro`
    });

    showToast(`Welcome to FlowState Pro, ${nameInput.trim()}! 🚀`, 'success');
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-card__header">
          <h2>Welcome to FlowState Pro 🚀</h2>
          <p>Let's customize your workspace. Enter your details to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-card__form">
          <div className="form-field">
            <label htmlFor="onboarding-name" className="onboarding-label">What is your name?</label>
            <input
              id="onboarding-name"
              type="text"
              required
              placeholder="e.g. Sagheer"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="onboarding-input"
            />
          </div>

          <div className="form-field">
            <label htmlFor="onboarding-role" className="onboarding-label">What is your role?</label>
            <input
              id="onboarding-role"
              type="text"
              required
              placeholder="e.g. Product Engineer"
              value={roleInput}
              onChange={(e) => setRoleInput(e.target.value)}
              className="onboarding-input"
            />
          </div>

          <button type="submit" className="onboarding-submit-btn">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
