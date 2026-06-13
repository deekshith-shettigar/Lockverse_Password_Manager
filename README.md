# 🔐 LockVerse

**Your Secure and Modern Password Manager**

LockVerse is a full-stack password management application that helps you securely store and manage all your login credentials in one place. Built with modern web technologies, it provides a clean, intuitive interface with enterprise-grade security features.

## 🌐 Live Demo

- **Frontend:** https://lockverse-frontend.onrender.com
- **Backend:** https://lockverse-password-manager.onrender.com

---

## ✨ Features

- 🔒 **Secure Password Storage** — Vault passwords encrypted with AES-256-CBC before storing in MongoDB
- 🔐 **JWT Authentication** — Signed tokens issued at login, verified on every request
- 📧 **Email Verification** — New accounts must verify their email before logging in
- 🔑 **Forgot Password** — OTP-based 3-step password reset via email
- 🛡️ **Brute-Force Protection** — Rate limiting on login (10/15 min) and OTP send (5/15 min)
- 🔍 **Smart Search** — Real-time password search by site or username
- 👁️ **Show/Hide Passwords** — Toggle password visibility
- 📋 **One-Click Copy** — Copy credentials to clipboard instantly
- ✏️ **Edit & Delete** — Full CRUD for saved passwords
- 🎨 **Responsive Design** — Works on desktop, tablet, and mobile
- 🌐 **Landing Page** — Professional landing page with Home, About, and Contact sections
- 📬 **Contact Form** — Messages sent directly to owner's inbox via Nodemailer + Gmail
- 🎯 **User-Scoped Data** — Each user sees only their own passwords, enforced server-side

---

## 🔒 Security Features

| Feature | Detail |
|--------|--------|
| Password hashing | bcrypt with cost factor 12 |
| Vault encryption | AES-256-CBC with random IV per entry |
| Authentication | JWT (7-day expiry), verified server-side on every request |
| Email verification | Required before first login — token stored with 24hr TTL |
| OTP flow | 6-digit OTP, 10-minute expiry, stored in MongoDB (survives restarts) |
| Rate limiting | Login: 10 attempts / 15 min · OTP send: 5 attempts / 15 min |
| Password policy | Min 6 chars, must include letter + number + special character |
| No enumeration | Login and forgot-password never reveal whether an email exists |
| Secrets | All keys in `.env`, never committed to GitHub |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** — UI library
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Utility-first styling
- **React Toastify** — Toast notifications
- **UUID** — Unique IDs for vault entries

### Backend
- **Node.js + Express** — REST API
- **MongoDB Atlas** — Cloud NoSQL database
- **bcryptjs** — User password hashing
- **jsonwebtoken** — JWT auth
- **crypto (AES-256-CBC)** — Vault password encryption
- **Nodemailer + Gmail** — Transactional email (verification, OTP, contact form)
- **express-rate-limit** — Brute-force protection

### Deployment
- **Frontend** — Render (Static Site)
- **Backend** — Render (Web Service)
- **Database** — MongoDB Atlas

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- A Gmail account with [2-Step Verification](https://myaccount.google.com/security) enabled and an [App Password](https://myaccount.google.com/apppasswords) generated

---

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

**`backend/.env`**
```env
MONGO_URI=your_mongodb_atlas_connection_string
DB_NAME=your_database_name
VAULT_SECRET=your_64_hex_character_secret_key
API_KEY=your_secret_api_key
EMAIL_USER=you@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_128_hex_character_jwt_secret
FRONTEND_URL=http://localhost:5173
```

> ⚠️ `EMAIL_PASS` must be a **Gmail App Password**, not your regular Gmail password.
> Generate one at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (requires 2-Step Verification to be ON).

**`.env` (frontend root)**
```env
VITE_BACKEND_URL=http://localhost:3000
```

Generate secrets:
```bash
# VAULT_SECRET (32 bytes → 64 hex chars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# JWT_SECRET (64 bytes → 128 hex chars)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5. Run the backend
```bash
cd backend
node server.js
```

### 6. Run the frontend
```bash
cd ..
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```
/
├── backend/
│   ├── server.js              # Express server, all API routes
│   ├── package.json           # Backend dependencies
│   └── .env                   # Backend secrets (not committed)
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Contact.jsx        # Contact form → sends email to owner
│   │   ├── Footer.jsx
│   │   ├── ForgotPassword.jsx # 3-step OTP password reset
│   │   ├── Home.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Manager.jsx        # Password vault UI
│   │   ├── Navbar.jsx
│   │   └── Signup.jsx         # Signup + email verification flow
│   ├── App.jsx                # Auth routing, JWT session management
│   ├── main.jsx
│   ├── App.css
│   └── index.css
├── public/
│   └── icons/
├── .env                       # Frontend env (not committed)
├── package.json
├── vite.config.js
└── tailwind.config.js
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Register — sends verification email |
| `GET` | `/verify-email?token=` | Verify email address |
| `POST` | `/login` | Login — returns JWT |
| `POST` | `/forgot-password/send-otp` | Send OTP to email |
| `POST` | `/forgot-password/verify-otp` | Verify OTP |
| `POST` | `/forgot-password` | Reset password |
| `POST` | `/contact` | Send contact form message to owner |

### Vault (requires `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Get logged-in user's passwords |
| `POST` | `/` | Save a new password |
| `DELETE` | `/` | Delete a password by ID |

---

## 💻 Usage

1. **Sign Up** — Enter name, email, and a strong password (min 6 chars, must include letter + number + special character)
2. **Verify Email** — Click the link sent to your inbox (expires in 24 hours)
3. **Login** — Access your password vault
4. **Add Password** — Enter website URL, username, and password → Save
5. **Search** — Use the navbar search to filter by site or username
6. **Copy** — Click copy icon to copy any credential to clipboard
7. **Edit** — Click edit icon to modify an entry
8. **Delete** — Click delete icon to remove an entry
9. **Forgot Password** — Enter email → receive OTP → verify → set new password

---

## 🚀 Deploying to Render

### Backend (Web Service)
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `node server.js`

Set these environment variables in Render → your backend service → **Environment**:

```
MONGO_URI        = your_mongodb_atlas_connection_string
DB_NAME          = passop
VAULT_SECRET     = your_64_hex_secret
API_KEY          = your_api_key
EMAIL_USER       = you@gmail.com
EMAIL_PASS       = your_gmail_app_password
JWT_SECRET       = your_128_hex_secret
FRONTEND_URL     = https://your-frontend.onrender.com
```

### Frontend (Static Site)
- **Root Directory:** *(leave blank)*
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

Set this environment variable in Render → your frontend service → **Environment**:

```
VITE_BACKEND_URL = https://your-backend.onrender.com
```

---

## 👨‍💻 Author

**Deekshith Shettigar**

- GitHub: [@deekshith-shettigar](https://github.com/deekshith-shettigar)
- LinkedIn: [linkedin.com/in/deekshith38](https://www.linkedin.com/in/deekshith38/)
- Instagram: [@_deekshith_s_](https://www.instagram.com/_deekshith_s_/)