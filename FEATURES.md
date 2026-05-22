# My Tracker - Premium Productivity Dashboard

A modern, dark-mode productivity tracker desktop web app with a premium UI inspired by SaaS products. Built with React, Tailwind CSS, Framer Motion, and Lucide Icons.

## ✨ Features

### Core Functionality
- ✅ **Full-Screen Dashboard** - Responsive desktop-first design
- ✅ **3-Column Layout** - Sidebar navigation, calendar center, task panel right
- ✅ **Modern Dark Theme** - Navy/black gradient background with purple & blue neon accents
- ✅ **Glassmorphism UI** - Soft glow effects, frosted glass cards
- ✅ **Smooth Animations** - Framer Motion animations throughout
- ✅ **Local Storage** - All tasks persisted in browser

### Left Sidebar
- 🎯 **Logo & Branding** - "My Tracker" app name with version
- 📍 **Navigation Menu**
  - Calendar
  - Tasks
  - Habits
  - Statistics
  - Notes
  - Goals
- 💫 **Active Menu Highlight** - Purple glow effect on active item
- 📊 **Daily Progress Card** - Visual progress bar with completion percentage
- 🌙 **Dark Mode Toggle** - Switch between themes (dark mode implementation ready)
- ⚙️ **Settings Button** - Future settings access

### Center Calendar Section
- 📅 **Modern Calendar View** - Large monthly calendar display
- 🎨 **Color-Coded Dates**
  - Saturdays in purple
  - Sundays in red
  - Current date with neon purple border
- 📌 **Task Indicators** - Colored dots showing tasks for each date
- ⏮️ **Month Navigation** - Previous/Next buttons
- 🎯 **Today Button** - Quick jump to current date
- 👁️ **View Switcher** - Day/Week/Month/Year views
- ➕ **Add Task Button** - Prominent glowing call-to-action
- ✨ **Hover Animations** - Smooth scale and elevation effects

### Right Task Panel
- 📋 **My To Do List** - Titled panel for selected date
- ✅ **Task Cards**
  - Task title and description
  - Start and end dates
  - Completion checkbox with animation
  - Priority badges (High/Medium/Low)
  - Category colors
  - Delete button with hover effect
- 📊 **Statistics Section**
  - Overall completion percentage with animated bar
  - Completed tasks count
  - In-progress tasks count
  - Task-specific view for selected date

### Add Task Modal
- 🎪 **Beautiful Modal Popup** - Animated entry with backdrop blur
- 📝 **Form Fields**
  - Task title (required)
  - Description (optional)
  - Category dropdown
  - Priority dropdown
  - Start date picker
  - End date picker
- ✨ **Form Validation** - Error display for required fields
- 💾 **Submit Buttons** - Cancel and Add Task with hover effects

### Functionality
- ✅ **Create Tasks** - Add new tasks with all details
- ✅ **Edit Tasks** - Update task information
- ✅ **Complete Tasks** - Toggle task completion with checkbox
- ✅ **Delete Tasks** - Remove tasks with confirmation
- ✅ **Task Persistence** - LocalStorage auto-save
- ✅ **Date Selection** - Click calendar dates to filter tasks
- ✅ **Calendar Navigation** - Move between months
- ✅ **Real-Time Updates** - Instant UI updates on task changes
- ✅ **Statistics** - Live completion tracking

## 🎨 Design Features

### Visual Design
- 🌑 **Dark Mode Only** - Navy #0f172a to slate #1e293b gradient
- 💜 **Purple Accents** - Primary brand color #a855f7
- 🔵 **Blue Accents** - Secondary color #3b82f6
- ✨ **Glow Effects** - Neon borders and shadows
- 🔘 **Rounded Corners** - 20px+ border-radius throughout
- 🪟 **Glassmorphism** - Frosted glass effect with backdrop blur
- 🎭 **Shadows & Depth** - Multi-layer shadow effects

### Animations
- 🎬 **Framer Motion** - Smooth page transitions
- 🌊 **Pulse Effects** - Glowing button effects
- 📱 **Hover States** - Scale and lift animations
- 🎪 **Modal Entry** - Spring animations for modals
- 🔄 **Progress Bars** - Smooth width animations
- 🎨 **Background** - Animated gradient rotation

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx           # Left navigation sidebar
│   ├── Calendar.jsx          # Monthly calendar grid
│   ├── CalendarHeader.jsx    # Calendar controls & navbar
│   ├── CenterSection.jsx     # Calendar container
│   ├── TaskPanel.jsx         # Right task list panel
│   ├── TaskCard.jsx          # Individual task component
│   └── AddTaskModal.jsx      # Add/edit task modal
├── context/
│   └── TaskContext.jsx       # Global task state management
├── hooks/
│   └── useTaskContext.js     # Custom hook for context
├── utils/
│   └── dateUtils.js          # Date formatting utilities
├── data/
│   └── dummyData.js          # Sample tasks for demo
├── App.jsx                   # Main app component
├── index.css                 # Tailwind & global styles
└── main.jsx                  # React entry point
```

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide Icons** - Beautiful icon set
- **JavaScript ES6+** - Modern JavaScript

## 🚀 Getting Started

### Installation
```bash
cd "d:\my to do app"
npm install
```

### Development
```bash
npm run dev
```
App will run on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 📊 Data Structure

### Task Object
```javascript
{
  id: string,                 // Unique identifier
  title: string,             // Task name
  description: string,       // Optional details
  startDate: "YYYY-MM-DD",   // Start date
  endDate: "YYYY-MM-DD",     // End date
  category: string,          // personal|work|health|learning|shopping
  priority: string,          // low|medium|high
  completed: boolean,        // Completion status
  color: string              // Category color
}
```

## 💾 State Management

- **TaskContext** - Global state for all tasks
- **Local State** - Component-level state for UI (selected date, modal visibility)
- **LocalStorage** - Persistent task data in browser

## 🎯 Key Functionalities Implemented

1. **Task Management**
   - Create, read, update, delete tasks
   - Persist to localStorage
   - Real-time UI updates

2. **Calendar Navigation**
   - Month navigation
   - Today quick access
   - Multi-view support (Day/Week/Month/Year)

3. **Task Filtering**
   - Filter tasks by selected date
   - Show tasks spanning multiple dates
   - Task dot indicators on calendar

4. **Progress Tracking**
   - Completion percentage
   - Task status counts
   - Animated progress bars

5. **User Experience**
   - Smooth animations
   - Responsive hover states
   - Keyboard shortcuts (Escape to close modal)
   - Form validation with error display

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize:
- `navy`: Primary dark color
- `slate`: Secondary dark color
- Purple/Blue accents in gradients

### Fonts
Currently using Inter font from Google Fonts via `index.css`

### Animations
Adjust animation speeds in component files:
- `transition={{ duration: 0.5 }}` - Framer Motion delays
- `@keyframes` in CSS - Custom animations

## 📱 Browser Support

- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅

## 🔒 Privacy

- All data stored locally in browser
- No external API calls
- No data sent to servers
- Complete privacy protection

## 🚀 Future Enhancements

- [ ] Light mode implementation
- [ ] Habit tracking module
- [ ] Statistics dashboard with charts
- [ ] Notes section
- [ ] Goal setting & tracking
- [ ] Task search functionality
- [ ] Keyboard shortcuts panel
- [ ] Export/Import functionality
- [ ] Mobile responsive design
- [ ] Dark mode animation preferences

## 📝 License

This is a premium productivity tracker demo app built for personal use.

---

**Version:** 1.0  
**Built with:** React + Vite + Tailwind CSS + Framer Motion
