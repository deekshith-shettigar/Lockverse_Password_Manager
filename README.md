# LockVerse - Password Manager

LockVerse is a secure password manager application built with React, Node.js, and MongoDB. It allows users to store, manage, and organize their passwords in a secure and user-friendly interface.

## Features

- **Secure Password Storage**: Store your passwords securely with a user-friendly interface
- **Password Generation**: Generate strong, random passwords
- **Encryption**: Passwords are stored with proper security measures
- **Copy to Clipboard**: Easily copy usernames, passwords, and URLs with one click
- **Edit/Delete Functionality**: Modify or remove existing password entries
- **Responsive Design**: Works on desktop and mobile devices
- **MongoDB Integration**: Persistent storage using MongoDB database

## Tech Stack

### Frontend
- React 19
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Toastify (Notifications)
- UUID (Unique ID generation)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Dotenv (Environment variables)
- Body-parser (Request parsing)
- CORS (Cross-origin resource sharing)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB database (local or cloud instance)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install frontend dependencies:
```bash
cd passop-mongo
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up environment variables:
Create a `.env` file in the `backend` directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
DB_NAME=your_database_name
```

## Usage

1. Start the backend server:
```bash
cd backend
npm start
```
or
```bash
node server.js
```

2. Start the frontend development server:
```bash
cd ..
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

## How It Works

1. **Add Passwords**: Fill in the website URL, username, and password fields, then click "Save Password"
2. **View Passwords**: All saved passwords are displayed in a table format
3. **Copy Information**: Click the copy icon next to any field to copy its content to clipboard
4. **Edit Passwords**: Click the edit icon to modify an existing password entry
5. **Delete Passwords**: Click the delete icon to remove a password entry

## Security Features

- Passwords are stored in a MongoDB database
- Sensitive information is handled securely
- Password visibility toggle to show/hide passwords
- Unique IDs generated for each password entry

## Project Structure

```
passop-mongo/
├── src/
│   ├── components/
│   │   ├── Manager.jsx (Main password management component)
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── App.jsx
│   └── main.jsx
├── backend/
│   ├── server.js (Main server file)
│   ├── package.json
│   └── package-lock.json
├── public/
│   └── icons/
├── package.json
└── README.md
```

## API Endpoints

- `GET /` - Retrieve all saved passwords
- `POST /` - Save a new password
- `DELETE /` - Delete a password by ID

## Deployment

### Netlify

To deploy this website on Netlify:

1. **Push to a Git Repository**:
   - Create a new repository on GitHub, GitLab, or Bitbucket.
   - Push the code to the repository:
     ```bash
     git remote add origin <repository-url>
     git branch -M main
     git push -u origin main
     ```

2. **Connect to Netlify**:
   - Go to [Netlify](https://www.netlify.com/).
   - Sign in or create an account.
   - Click "New site from Git".
   - Connect your Git provider (GitHub, GitLab, or Bitbucket).
   - Select the repository you just created.

3. **Configure Build Settings**:
   - Netlify will automatically detect the build settings from `netlify.toml`.
   - The build command is `npm run build`.
   - The publish directory is `dist`.

4. **Deploy**:
   - Click "Deploy site".
   - Netlify will build and deploy your website.

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgements

- React for the frontend framework
- MongoDB for the database solution
- Vite for the build tool
- Tailwind CSS for styling
