# ExpenseFlow – MERN & MEAN Expense Tracker

A full-stack expense management application built with Node.js, Express, MongoDB, and two frontends (React & Angular).

One Backend. Two Frontends. Scalable Architecture.

# Features
Authentication & Security
JWT-based Authentication
Google OAuth Login
Role-Based Access Control (Admin & User)

👤 User Features
Add, edit, delete expenses
Categorize expenses (Food, Travel, Bills, etc.)
View dashboard with charts & summaries
Advanced filtering & search
Export reports (CSV/PDF)
🛠 Admin Features
Manage users
View all expenses
Generate system-wide reports

# Architecture
React App (MERN)     Angular App (MEAN)
        \              /
         \            /
          ---- REST API ----
                |
        Node.js + Express
                |
            MongoDB

Single backend serving multiple frontends

# Tech Stack
Backend
Node.js
Express.js
MongoDB + Mongoose
JWT Authentication
Google OAuth
Multer (File Upload)
ExcelJS & jsPDF (Export)

Frontend (MERN)
React 18
React Router v6
Axios
Context API / Redux
Chart.js / ApexCharts
Tailwind CSS / Material UI
Frontend (MEAN)
Angular 15+
Angular Router
RxJS
Angular Material / PrimeNG

# Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/expenseflow.git
cd expenseflow
2️⃣ Backend Setup
cd backend
npm install

# Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id

# Run backend:

npm run dev
3️⃣ React Frontend (MERN)
cd frontend-react
npm install
npm start
4️⃣ Angular Frontend (MEAN)
cd frontend-angular
npm install
ng serve

# API Endpoints (Sample)
Auth
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Expenses
GET /api/expenses
POST /api/expenses
PUT /api/expenses/:id
DELETE /api/expenses/:id

Reports
GET /api/reports/summary
GET /api/reports/by-category

# Security
Password hashing using bcrypt
JWT authentication
Role-based authorization
Input validation (Joi / express-validator)
Environment variables for secrets

# Future Enhancements
📩 Budget alert notifications
🔁 Recurring expenses
🧾 Receipt OCR scanning
🌍 Multi-currency support
📱 Mobile app (React Native / Flutter)
🤖 AI-based expense insights
