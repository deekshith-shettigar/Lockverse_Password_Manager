# 🔐 LockVerse

**Your Simple and Secure Password Manager**

LockVerse is a full-stack password management application that helps you securely store and manage all your login credentials in one place. Built with modern web technologies, it provides a clean, intuitive interface for organizing your passwords across multiple websites and applications.

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
- **MongoDB** - NoSQL database for data storage
- **CORS** - Cross-Origin Resource Sharing middleware

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn package manager


## 📂 Project Structure

```
passop-mongo/
├── api/                    # Serverless API functions (for Vercel)
│   ├── index.js           # Password CRUD operations
│   ├── login.js           # Login endpoint
│   ├── signup.js          # Signup endpoint
│   ├── forgot-password.js # Password reset endpoint
│   └── package.json       # API dependencies
├── backend/
│   ├── server.js          # Express server (for local development)
│   ├── package.json       # Backend dependencies
│   └── .env               # Environment variables
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
├── vercel.json            # Vercel deployment configuration
├── .vercelignore          # Files to exclude from deployment
├── tailwind.config.js
├── DEPLOYMENT.md          # Detailed deployment guide
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /signup` - Create a new user account
- `POST /login` - Login with username/email and password
- `POST /forgot-password` - Reset password

### Password Management
- `GET /` - Get all passwords for the authenticated user
- `POST /` - Save a new password
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

- Password input fields with show/hide toggle
- User-specific data isolation
- Confirmation dialog before deleting passwords
- Secure MongoDB storage
- CORS protection

## 👨‍💻 Author

**Deekshith Shettigar**
