# 🔐 LockVerse

**Your Simple and Secure Password Manager**

LockVerse is a full-stack password management application that helps you securely store and manage all your login credentials in one place. Built with modern web technologies, it provides a clean, intuitive interface for organizing your passwords across multiple websites and applications.

## 🌐 Live Demo

- **Frontend:** https://lockverse-frontend.onrender.com
- **Backend:** https://lockverse-password-manager.onrender.com

## ✨ Features

- 🔒 **Secure Password Storage** - Store website URLs, usernames, and passwords safely in MongoDB
- 🔍 **Smart Search** - Quickly find your passwords with real-time search functionality
- 👁️ **Show/Hide Passwords** - Toggle password visibility for easy viewing
- 📋 **One-Click Copy** - Copy credentials to clipboard with a single click
- ✏️ **Edit & Delete** - Manage your saved passwords with ease
- 🎨 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🔐 **User Authentication** - Secure login and signup system
- 🔑 **Password Recovery** - Forgot password functionality
- 🌐 **Landing Page** - Professional landing page with About and Contact sections
- 🎯 **User-Scoped Data** - Each user sees only their own passwords

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building interactive user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework for styling
- **React Toastify** - Beautiful toast notifications
- **UUID** - Generate unique identifiers for passwords

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud NoSQL database for data storage
- **bcryptjs** - Password hashing for user accounts
- **crypto (AES-256-CBC)** - Encryption for stored vault passwords
- **CORS** - Cross-Origin Resource Sharing middleware

### Deployment
- **Frontend** - Render (Static Site)
- **Backend** - Render (Web Service)
- **Database** - MongoDB Atlas

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/deekshith-shettigar/Lockverse_Password_Manager.git
cd Lockverse_Password_Manager
```

### 2. Install frontend dependencies
```bash
npm install
```

### 3. Install backend dependencies
```bash
cd backend
npm install
```

### 4. Set up environment variables

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_atlas_connection_string
DB_NAME=your_database_name
VAULT_SECRET=your_64_hex_character_secret_key
API_KEY=your_secret_api_key
```

Generate VAULT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create `.env` in root (for frontend):
```env
VITE_API_KEY=your_secret_api_key
```

### 5. Run the backend
```bash
cd backend
node server.js
```

### 6. Run the frontend
```bash
npm run dev
```

## 📂 Project Structure

```
passop-mongo/
├── backend/
│   ├── server.js           # Express server and API routes
│   ├── package.json        # Backend dependencies
│   └── .env               # Environment variables (not committed)
├── src/
│   ├── components/
│   │   ├── About.jsx      # About section
│   │   ├── Contact.jsx    # Contact section
│   │   ├── Footer.jsx     # Footer component
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx       # Home/Hero section
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx      # Login form
│   │   ├── Manager.jsx    # Password manager UI
│   │   ├── Navbar.jsx     # Navigation bar
│   │   └── Signup.jsx     # Signup form
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # React entry point
│   ├── App.css
│   └── index.css
├── public/
│   └── icons/             # Eye icons and other assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /signup` - Create a new user account
- `POST /login` - Login with username/email and password
- `POST /forgot-password` - Reset password

### Password Management (requires x-api-key header)
- `GET /` - Get all passwords (decrypted for frontend use)
- `POST /` - Save a new password (encrypted before storing)
- `DELETE /` - Delete a password by ID

## 💻 Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Login**: Access your password vault
3. **Add Password**: Enter website URL, username, and password, then click "Save Password"
4. **Search**: Use the search bar in the navbar to filter passwords by username or site
5. **Copy**: Click the copy icon to copy credentials to clipboard
6. **Edit**: Click the edit icon to modify existing passwords
7. **Delete**: Click the delete icon to remove passwords (with confirmation)
8. **Toggle Visibility**: Click the eye icon to show/hide passwords in the input field

## 🔒 Security Features

- **bcrypt hashing** - User account passwords are hashed with bcrypt (cost factor 12) and never stored in plain text
- **AES-256-CBC encryption** - Vault passwords are encrypted with AES-256 before storing in MongoDB
- **API Key protection** - Password routes are protected with a secret API key header
- **User-scoped data** - Each user only sees their own passwords
- **Environment variables** - All secrets stored in .env (never committed to GitHub)
- **Password input fields** - Show/hide toggle for easy viewing
- **Confirmation dialog** - Before deleting passwords
- **CORS protection** - Cross-Origin Resource Sharing middleware

## 👨‍💻 Author

**Deekshith Shettigar**

- GitHub: [@deekshith-shettigar](https://github.com/deekshith-shettigar)