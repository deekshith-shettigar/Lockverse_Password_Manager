// In development: uses Vite proxy which forwards /api to http://localhost:3000
// In production (Vercel): uses serverless functions at /api
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default API_BASE_URL;
