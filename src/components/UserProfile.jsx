import { useState } from 'react';
import { useFetch } from '../hooks/useFetch.js';
import { fetchUser } from '../data/mockApi.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function UserProfile() {
  const { data: remoteUser, loading } = useFetch(() => fetchUser(1), []);
  const { user, updateProfile, incrementTasksCompleted } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editRole, setEditRole] = useState(user.role);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editDept, setEditDept] = useState(user.department);

  const initial = user.name ? user.name.charAt(0).toUpperCase() : '?';
  
  // Calculate productivity level badge
  let productivityLevel = 'Focus Novice 💡';
  let badgeClass = 'novice';
  if (user.tasksCompleted >= 5 && user.tasksCompleted < 15) {
    productivityLevel = 'Task Champion 🚀';
    badgeClass = 'champion';
  } else if (user.tasksCompleted >= 15) {
    productivityLevel = 'Elite Focus Master 👑';
    badgeClass = 'master';
  }

  const handleStartEdit = () => {
    setEditName(user.name);
    setEditRole(user.role);
    setEditEmail(user.email);
    setEditDept(user.department);
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfile({
      name: editName,
      role: editRole,
      email: editEmail,
      department: editDept
    });
    setIsEditing(false);
    showToast('Profile changes saved successfully! 💾', 'success');
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleIncrement = () => {
    incrementTasksCompleted();
    showToast('Focus stats updated! 🚀', 'success');
  };

  return (
    <section className="user-profile">
      <h2>Profile</h2>

      <div className="user-profile__header">
        <div className="user-profile__avatar">{initial}</div>
        <div className="user-profile__title-group">
          {isEditing ? (
            <input
              className="user-profile__edit-input user-profile__edit-input--name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Name"
              aria-label="Name"
            />
          ) : (
            <h3>{user.name}</h3>
          )}
          <span className={`user-profile__badge user-profile__badge--${badgeClass}`}>
            {productivityLevel}
          </span>
        </div>
      </div>

      <div className="user-profile__card">
        <div className="profile-details__grid">
          <div className="profile-detail__item">
            <span className="detail-label">Email</span>
            {isEditing ? (
              <input
                className="user-profile__edit-input"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email"
                aria-label="Email"
              />
            ) : (
              <span className="detail-value">{user.email}</span>
            )}
          </div>
          <div className="profile-detail__item">
            <span className="detail-label">Department</span>
            {isEditing ? (
              <input
                className="user-profile__edit-input"
                value={editDept}
                onChange={(e) => setEditDept(e.target.value)}
                placeholder="Department"
                aria-label="Department"
              />
            ) : (
              <span className="detail-value">{user.department}</span>
            )}
          </div>
          <div className="profile-detail__item">
            <span className="detail-label">Designation</span>
            {isEditing ? (
              <input
                className="user-profile__edit-input"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                placeholder="Designation"
                aria-label="Designation"
              />
            ) : (
              <span className="detail-value">{loading ? 'Loading…' : (user.role || 'Product Engineer')}</span>
            )}
          </div>
          <div className="profile-detail__item">
            <span className="detail-label">Focus Stats</span>
            <span className="detail-value">{user.tasksCompleted} Tasks Completed</span>
          </div>
        </div>

        <div className="profile-card__actions">
          {isEditing ? (
            <>
              <button onClick={handleSave} className="profile-card__btn profile-card__btn--save">
                Save Changes
              </button>
              <button onClick={handleCancel} className="profile-card__btn profile-card__btn--cancel">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={handleStartEdit} className="profile-card__btn profile-card__btn--edit">
                Edit Profile
              </button>
              <button onClick={handleIncrement} className="profile-card__btn profile-card__btn--increment">
                +1 Task Completed
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
