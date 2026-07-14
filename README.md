# ✨ FlowState Pro

FlowState Pro is a beautiful, premium, and feature-rich productivity dashboard and task manager. Built with **React 18 + Vite** and powered by **Google Gemini 1.5 Flash AI**, it features relative due-date alerts, custom Pomodoro focus timers, and a fully responsive glassmorphism layout that transforms into a native-like mobile app on smaller screens.

---

## 🚀 Key Features

### 📊 Live Analytics Dashboard
* **Real-time Performance Metrics**: Instantly track total tasks, completed items, pending workloads, and high-priority duties.
* **Overdue Tasks Warning Panel**: A custom glowing red metrics card that aggregates and tracks past-due checklist items.
* **Dynamic Refresh Quotes**: A custom glassmorphism card that presents inspiring, funny, or wise quotes about life, attitude, happiness, and blessings on every page reload.

### ⏱️ Pomodoro Focus Timer
* **Quick Presets**: Jump straight into Focus (25m), Short Break (5m), or Long Break (15m) sessions.
* **Ambient Glow Backgrounds**: Dynamic gradients change color matching your current state (Purple focus, Green short break, Cyan long break).
* **Audio Alerts**: A browser audio synthesizer beep triggers on session completion.
* **Control Locks**: Anti-accidental-reset timer locks to protect active focus periods.

### ✨ Google Gemini AI Copilot
* **Live Gemini 1.5 Flash Integration**: Input your free API key from Google AI Studio (saved securely in local storage) to activate a conversational AI assistant.
* **One-Click Task Additions**: Gemini recommends short, actionable tasks based on user requests, which the UI automatically formats into interactive `+ Add` buttons.
* **Offline Backup**: Seamlessly falls back to an offline local keyword-matching assistant when no API key is configured.

### ✅ Advanced Task Management
* **Deadline Tracking**: Relative badges (Overdue 📅, Due Today 📅, Upcoming 📅, Done) change colors dynamically.
* **Prioritization & Categorization**: Color-coded borders tag tasks by priority (High, Medium, Low) and categories (Engineering, Design, Docs, Marketing, Sales, General).
* **Search & Filters**: Debounced instant search queries and filter blocks.

### 👤 Premium User Profiles
* **Initials Avatar Circles**: Custom circular avatars generated automatically.
* **Inline Card Editing**: Click inline to directly update name, email, role, and department metadata fields without leaving the profile card.
* **Designation Levels**: Dynamic gamified titles (`Focus Novice 💡`, `Task Champion 🚀`, `Elite Focus Master 👑`) unlock as you finish goals.

### 🔔 Global Toast System
* Beautiful floating context notifications with micro-animations highlighting task creations, checklist ticks, deletions, timer alerts, and profile changes.
* Monitors network states to push warnings when the app goes offline.

### 📱 Responsive Mobile Layout
* Stretches and re-aligns the sidebar layout into a fixed bottom navigation bar on screen widths `< 768px`.
* Adapts dashboard statistics, profile details, and task forms to single-column flex grids for mobile comfort.

---

## 🛠️ Technology Stack
* **Framework**: React 18 (Hooks, Context API, useReducer state sync)
* **Build Tool**: Vite
* **Styling**: Vanilla CSS (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Keyframe animations)
* **API Integration**: Native Google Gemini AI REST API (`generativeContent` endpoint)

---

## 💻 Quick Setup

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/YOUR_USERNAME/flowstate-pro.git
cd flowstate-pro
npm install
```

### 2. Run Locally
Launch the local development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
Compile the application bundle:
```bash
npm run build
```
Vite will output the optimized static build folder in `/dist`, ready to be uploaded to Netlify, Vercel, or GitHub Pages.

---

## ⚙️ AI Studio Setup (Optional)
To enable the conversational AI Copilot:
1. Visit [Google AI Studio](https://aistudio.google.com/) and create a free Gemini API Key.
2. In FlowState Pro, click the **Copilot bubble** (bottom right).
3. Click the gear settings icon (⚙️) in the chat header, paste your key, and click **Save**.

---

## 📁 Project Structure
```text
flowstate-pro/
├── public/                 # Static assets
├── src/
│   ├── components/         # React Views (Dashboard, TaskList, PomodoroTimer, UserProfile, AiCopilot)
│   ├── context/            # Shared contexts (AuthContext, ThemeContext, ToastContext)
│   ├── hooks/              # Custom helper hooks (useLocalStorage, useDebounce)
│   ├── reducers/           # State reducer models (taskReducer)
│   ├── App.jsx             # Main router & layout builder
│   ├── index.css           # Global custom stylesheet
│   └── main.jsx            # React root mount entry
├── index.html              # HTML shell & SVG favicon link
├── package.json            # Scripts & dependencies manifest
└── vite.config.js          # Vite config
```

---

## 📄 License
MIT License. Created with ❤️ for premium productivity.
