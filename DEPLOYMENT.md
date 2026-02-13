# Vercel Deployment Guide for LockVerse

## Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. MongoDB Atlas account with a database set up
3. Git repository (optional but recommended)

## Environment Variables
You'll need to set these environment variables in Vercel:

1. `MONGO_URI` - Your MongoDB connection string
   Example: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

2. `DB_NAME` - Your MongoDB database name
   Example: `lockverse`

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Prepare for Vercel deployment"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Import your Git repository
   - Vercel will auto-detect it as a Vite project

3. **Configure Project**
   - Root Directory: `passop-mongo`
   - Framework Preset: Vite
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)

4. **Add Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add:
     - `MONGO_URI` = your MongoDB connection string
     - `DB_NAME` = your database name
   - Apply to: Production, Preview, and Development

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to project directory**
   ```bash
   cd passop-mongo
   ```

4. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts:
   - Set up and deploy? Yes
   - Which scope? Select your account
   - Link to existing project? No
   - Project name? (press enter for default)
   - Directory? `./`
   - Override settings? No

5. **Add Environment Variables**
   ```bash
   vercel env add MONGO_URI
   vercel env add DB_NAME
   ```
   Follow prompts to set values.

6. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## File Structure After Setup
```
passop-mongo/
├── api/                    # Vercel Serverless Functions
│   ├── index.js           # Password CRUD operations
│   ├── login.js           # Login endpoint
│   ├── signup.js          # Signup endpoint
│   ├── forgot-password.js # Password reset endpoint
│   └── package.json       # API dependencies
├── src/                   # Frontend React code
├── dist/                  # Build output (auto-generated)
├── vercel.json           # Vercel configuration
├── .vercelignore         # Files to exclude from deployment
└── package.json          # Frontend dependencies
```

## API Routes
After deployment, your API will be available at:
- `https://your-project.vercel.app/api` - Password management
- `https://your-project.vercel.app/api/login` - User login
- `https://your-project.vercel.app/api/signup` - User signup
- `https://your-project.vercel.app/api/forgot-password` - Password reset

## Important Notes

1. **Environment Variables**: Make sure to add your MongoDB credentials in Vercel dashboard
2. **MongoDB IP Whitelist**: Add `0.0.0.0/0` to MongoDB Atlas Network Access to allow Vercel's serverless functions
3. **Cold Starts**: First request after inactivity may be slow due to serverless cold starts
4. **Logs**: View function logs in Vercel dashboard → Project → Functions tab

## Troubleshooting

### API not working
- Check environment variables in Vercel dashboard
- Verify MongoDB connection string is correct
- Check MongoDB Network Access allows all IPs (0.0.0.0/0)

### Build fails
- Ensure all dependencies are in package.json
- Check build logs for specific errors
- Verify Node.js version compatibility

### Database connection errors
- Verify MONGO_URI format
- Check DB_NAME matches your database
- Ensure MongoDB user has read/write permissions

## MongoDB Atlas Setup

1. Create a cluster at https://cloud.mongodb.com
2. Create a database user (Database Access)
3. Whitelist all IPs: `0.0.0.0/0` (Network Access)
4. Get connection string from "Connect" → "Connect your application"
5. Replace `<password>` with your database user password
6. Add connection string as `MONGO_URI` in Vercel

## Support
For issues, check:
- Vercel Deployment Logs
- Vercel Function Logs
- MongoDB Atlas Logs
