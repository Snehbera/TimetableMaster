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

 **Frontend:** React (with Vite)
  - **State Management:** Zustand (with persist middleware)
  - **Styling:** Tailwind CSS
  - **Routing:** React Router DOM
  - **Backend (optional):** Node.js / Express or Flask (for solver logic)

**Backend**
  - **Framework: Django**
  - **API: Django REST Framework**
  - **CORS: django-cors-headers**

---

## 🚀 Getting Started

Follow these instructions to get the project running locally.

### Prerequisites
- Python **v3.8+** & pip
- Node.js **v16+**
- npm **v7+**

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Snehbera/TimetableMaster.git
cd TimetableMaster

# 1 - Backend Setup

# Navigate to the backend directory
cd backend

# Create and activate the virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install django djangorestframework django-cors-headers

# Run the Django development server
python manage.py runserver


# 2 - Frontend Setup

# Navigate to the frontend directory from the project root
cd frontend

# Install Node.js dependencies
npm install

# Run the React development server
npm run dev
```

### 📂 Project Structure
The project follows a feature-based folder structure to keep the code organized and easy to navigate. 

```
/TimetableMaster
├── backend/
│   ├── api/              # Django app for API logic (views.py, urls.py)
│   ├── config/           # Main Django project configuration (settings.py)
│   ├── venv/             # Python virtual environment (ignored by Git)
│   └── manage.py         # Django's command-line utility
│
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Global, reusable components
│   │   ├── features/     # Main application features/pages
│   │   │   └── Timetables/
│   │   │       └── Steps/  # Each step of the wizard
│   │   ├── Stores/
│   │   │   └── TimetableStore.jsx # Zustand global store
│   │   ├── main.jsx      # React entry point
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore            # Root gitignore for both projects
```