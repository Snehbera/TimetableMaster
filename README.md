📅 TimetableMaster: Intelligent Academic SchedulerTimetableMaster is an AI-powered scheduling engine designed for higher education institutions. It automates the complex task of creating clash-free academic timetables while accounting for infrastructure limits, faculty availability, and specific curriculum requirements.🚀 Core Features🧠 AI-Driven CSP SolverConstraint Satisfaction: Uses an optimized Backtracking algorithm to ensure no faculty or classroom clashes.Smart Compaction: Minimizes "gaps" in the schedule to provide students and faculty with back-to-back sessions.Concurrent Lab Logic: Handles complex multi-batch laboratory sessions where multiple partitions are taught simultaneously by different faculty.🔌 Seamless IntegrationsGoogle Calendar Sync: Export generated timetables directly to Google Calendar. Automatically creates a dedicated calendar and shares it with students/faculty via email.RESTful Architecture: A decoupled React frontend and Django REST Framework backend for high performance.PDF Export: Generate high-quality, print-ready PDF versions of timetables using WeasyPrint.🛠️ Tech StackComponentTechnologyFrontendReact.js, Tailwind CSSBackendDjango 5.2.4, Django REST Framework (DRF)AlgorithmPython-based CSP Solver (Backtracking)DatabaseSQLite (Development) / PostgreSQL (Production)AuthenticationDjango Allauth & REST AuthExternal APIsGoogle Calendar API v3🏗️ Project StructurePlaintextTimetableMaster/
├── prototype/               # Django Project Configuration
├── timetable_app/           # Main Backend Logic
│   ├── templatetags/        # Custom DTL Filters (get_item, etc.)
│   ├── timetablegenerator.py # AI Solver Class
│   └── views.py             # API & Template logic
├── auth_api/                # User Authentication handling
├── media/                   # Exported files (PDFs)
└── .gitignore               # Configured for Python, Django, and Environments
⚙️ Installation & Setup1. Environment SetupBash# Create and activate environment
python -m venv env
.\env\Scripts\activate  # Windows

# Install Dependencies
pip install django djangorestframework django-cors-headers django-allauth \
            django-rest-auth google-auth-oauthlib google-api-python-client \
            pytz WeasyPrint requests
2. Database InitializationBashpython manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
3. Google API ConfigurationPlace your credentials.json from the Google Cloud Console in the root directory.The first time you sync, a token.pickle will be generated after OAuth2 approval.📝 Constraints EnforcedHard Constraints: Faculty uniqueness per slot, classroom availability, student batch non-overlap, and mandatory break times.Soft Constraints: Max 2 labs per day per division, subject daily uniqueness, and "no-gap" schedule compaction.🤝 ContributingFetch the latest changes: git fetch originReset to the backend branch: git reset --hard origin/DjangoBackendEnsure you do not track __pycache__ or .env files.Developed with ❤️ for Academic Efficiency.