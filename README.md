# Farmer-Governance-Aided-Schemes
A full-stack web application that enables farmers to view, apply for, and track government-aided schemes. Admins can manage schemes and approve/reject applications.

---

## 🔗 Tech Stack

### 🔧 Backend
- Node.js
- Express.js
- Firebase Admin SDK
- CORS, Axios
- Middleware (Auth Protection)
- Firestore Database

### 🎨 Frontend
- React.js
- Bootstrap
- React Router DOM
- Firebase Authentication

---

## 🚀 Features

- 🔐 Firebase Auth-based Registration & Login
- 🧑 Role-based Dashboard (User & Admin)
- 📜 View available government schemes
- 📩 Apply for government-aided schemes
- 📊 Track application status
- 🛠️ Admin panel for scheme creation, update, approval
- 🔒 Protected routes using middleware
- 🔄 Real-time sync with Firestore

---

## 📁 Project Structure

```bash
farmer-schemes-app/
├── backend/
│   ├── index.js
│   ├── firebaseAdmin.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   ├── public/
│   └── .env
