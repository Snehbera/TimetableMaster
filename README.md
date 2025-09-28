# Timetable Generator - Nexus

An interactive, multi-step web application designed to help educational institutions seamlessly create, manage, and organize complex timetables. This tool guides the user through a series of logical steps to input all necessary data, from general settings to specific room assignments, ensuring all constraints are captured before the final timetable is generated.

---

## ✨ Core Features

- **Multi-Step Wizard Interface**  
  A clean, guided process that simplifies the complex task of timetable creation.

- **Centralized State Management**  
  Powered by [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware, ensuring all progress is saved automatically to local storage.

- **Dynamic Subject Management**  
  Add subjects individually or bulk-import using a smart `"Short Name - Full Name"` parser.

- **Interactive Faculty Assignment**  
  Assign multiple subjects to faculty members via a modal with search support.

- **Automated Room & Lab Generation**  
  Intelligent generation of classrooms and labs based on divisions, subdivisions, and subject requirements.

- **Component-Based Architecture**  
  Modular, scalable codebase built with React.

- **Modern Tech Stack**  
  ⚡ Vite + 🌀 Tailwind CSS + ⚛️ React Router + Zustand  

---

## 🛠️ Tech Stack

- **Frontend:** React (with Vite)
- **State Management:** Zustand (with persist middleware)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **Backend (optional):** Node.js / Express or Flask (for solver logic)

---

## 🚀 Getting Started

Follow these instructions to get the project running locally.

### Prerequisites
- Node.js **v16+**
- npm **v7+**

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Snehbera/TimetableMaster.git
cd TimetableMaster

# Install dependencies
npm install

# Run the development server
npm run dev
```

### 📂 Project Structure
The project follows a feature-based folder structure to keep the code organized and easy to navigate. 

```
/src
├── assets/      # Static assets like images and fonts
├── components/  # Global, reusable components (e.g., NTTHeader)
├── features/    # Main application features/pages
│ ├── Dashboard/
│ ├── Header/
│ ├── Login/
│ └── Timetables/
│ └── NewTimetable/
│ ├── Steps/               # Contains each step of the wizard
│ │ ├── GeneralSettings.jsx
│ │ ├── Subjects.jsx
│ │ ├── Faculty.jsx
│ │ ├── Classes.jsx
│ │ └── Rooms.jsx
│ └── NTTLayout.jsx        # Routing Timetable Steps
├── Stores/
│ └── TimetableStore.jsx   # Zustand global store
├── main.jsx               # React entry point
├── Layout.jsx             # Main Routing
├── Index.jsx              # Main Webpage 
└── index.css              # Global styles
```