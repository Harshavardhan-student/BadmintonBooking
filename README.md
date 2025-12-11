# Badminton Court Booking System

A full-stack web application that enables users to book badminton courts, rent equipment, and optionally book coaches with availability-based scheduling and dynamic pricing. Includes a complete admin panel for managing courts, coaches, equipment, and pricing rules.

---

## 🚀 Features

### 🧑‍💻 User Features
- Browse courts (indoor/outdoor)
- Select date and time
- Live availability checks
- Dynamic pricing (peak hours, weekend, indoor premium, equipment fees, coach fees)
- Equipment rental selection
- Coach booking based on availability
- Confirm bookings (atomic multi-resource booking)
- View booking history

### 🛠 Admin Features
- Courts CRUD (create, update, disable/delete)
- Equipment CRUD with stock management
- Coaches CRUD + availability slots
- Pricing Rule CRUD (peak, weekend, indoor premium, custom)
- Dynamic rule-driven pricing engine
- Real-time updates after changes

---

## 🧱 Tech Stack

**Frontend:** React, React Router, Fetch API  
**Backend:** Node.js, Express  
**Database:** MongoDB with Mongoose  
**Styling:** Minimal CSS / Tailwind (optional)  
**Tools:** Nodemon, dotenv

---

## 📁 Project Structure

/backend
/src
/models
/routes
/controllers
/services
/utils
/config
seed.js
package.json

/frontend
/src
/pages
/components
App.jsx
main.jsx
package.json

README.md
ARCHITECTURE.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

git clone <your-repo-url>
cd project-folder
---

## 🗄 Backend Setup

cd backend
npm install


### Create `.env` file in backend:

MONGO_URI=mongodb://127.0.0.1:27017/badminton_booking
PORT=4000

### Start backend:

npm run dev


---

## 🌱 Seed the Database

Use this to quickly populate:

- Courts  
- Coaches  
- Equipment  
- Pricing Rules  


npm run seed

You will see:

Seed data inserted


---

## 💻 Frontend Setup


cd frontend
npm install
npm run dev


Open in browser:

👉 http://localhost:5173/

---

## 📡 Core API Endpoints

### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/courts | Get all courts |
| POST | /api/pricing/quote | Calculate dynamic pricing |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/me | User booking history |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| CRUD | /api/admin/courts | Courts admin |
| CRUD | /api/admin/equipment | Equipment admin |
| CRUD | /api/admin/coaches | Coaches admin |
| CRUD | /api/admin/pricing-rules | Pricing rules admin |

---
