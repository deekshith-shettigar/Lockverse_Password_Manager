import { useState, useEffect } from "react";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import LandingPage from "./components/LandingPage";

// ── Inline component shown after clicking the verification link ───────────────
function VerifyEmailResult({ result, onGoToLogin }) {
  if (!result) {
    return (
      <div className="min-h-[87vh] flex items-center justify-center">
        <p className="text-white text-lg">Verifying your email…</p>
      </div>
    )
  }
  return (
    <div className="min-h-[87vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/90 backdrop-blur rounded-2xl border border-green-300 p-8 shadow text-center">
        <div className="text-5xl mb-4">{result.success ? '✅' : '❌'}</div>
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          {result.success ? 'Email Verified!' : 'Verification Failed'}
        </h2>
        <p className="text-sm text-slate-600 mb-6">{result.message}</p>
        <button onClick={onGoToLogin}
          className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full px-6 py-3 text-white font-medium text-base">
          {result.success ? 'Go to Login' : 'Back to Login'}
        </button>
      </div>
    </div>
  )
}

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState("landing")
  const [currentUser, setCurrentUser] = useState(null)
  const [token, setToken] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [verifyResult, setVerifyResult] = useState(null) // { success, message }

  const handleLoginSuccess = (user, tok) => {
    setCurrentUser(user || null)
    setToken(tok || null)
    setIsAuthenticated(true)
    // Persist current user session
    try {
      if (user) localStorage.setItem('lv_current_user', JSON.stringify(user))
      if (tok)  localStorage.setItem('lv_token', tok)
    } catch (_) {}
  }

  const handleLogout = () => {
    localStorage.removeItem('lv_current_user')
    localStorage.removeItem('lv_token')
    sessionStorage.removeItem('lv_page_loaded')
    setCurrentUser(null)
    setToken(null)
    setIsAuthenticated(false)
    setAuthView('landing')
    try {
      localStorage.setItem('lv_auth_view', 'landing')
    } catch (_) {}
  }

  const handleSignIn = () => {
    setAuthView('login')
    try {
      localStorage.setItem('lv_auth_view', 'login')
      window.history.pushState({ page: 'login' }, '', '')
    } catch (_) {}
  }

  const handleSignUp = () => {
    setAuthView('signup')
    try {
      localStorage.setItem('lv_auth_view', 'signup')
      window.history.pushState({ page: 'signup' }, '', '')
    } catch (_) {}
  }

  // Handle /verify-email?token= links — called when user clicks the email link
  const handleVerifyEmail = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-email?token=${encodeURIComponent(token)}`)
      const data = await res.json()
      setVerifyResult({ success: data.success, message: data.message })
      setAuthView('verified')
    } catch {
      setVerifyResult({ success: false, message: 'Network error. Please try again.' })
      setAuthView('verified')
    }
  }

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (!isAuthenticated && (authView === 'login' || authView === 'signup' || authView === 'forgot')) {
        setAuthView('landing')
        try {
          localStorage.setItem('lv_auth_view', 'landing')
        } catch (_) {}
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [authView, isAuthenticated])

  useEffect(() => {
    // Handle email verification links: ?token=...
    const params = new URLSearchParams(window.location.search)
    const emailToken = params.get('token')
    if (emailToken) {
      // Clean the token from the URL immediately
      window.history.replaceState({}, '', window.location.pathname)
      handleVerifyEmail(emailToken)
      return
    }

    // Check if this is a new browser session
    const isNewSession = !sessionStorage.getItem('lv_page_loaded')
    
    if (isNewSession) {
      // Mark that page has been loaded in this session
      sessionStorage.setItem('lv_page_loaded', 'true')
      
      // Clear user login data on new browser session
      localStorage.removeItem('lv_current_user')
      
      // Check if user was on login/signup/forgot page - preserve it
      const savedView = localStorage.getItem('lv_auth_view')
      if (savedView === 'login' || savedView === 'signup' || savedView === 'forgot') {
        setAuthView(savedView)
        setIsAuthenticated(false)
        setCurrentUser(null)
        return
      }
      
      // Otherwise show landing page
      localStorage.removeItem('lv_auth_view')
      setAuthView('landing')
      setIsAuthenticated(false)
      setCurrentUser(null)
      return
    }

    // User refreshed the page (same session) - restore their session if logged in
    try {
      const rawUser = localStorage.getItem('lv_current_user')
      const savedToken = localStorage.getItem('lv_token')
      if (rawUser && savedToken) {
        // Decode the JWT payload (no crypto — just check expiry client-side as UX guard;
        // the server re-verifies the signature on every request regardless)
        const payload = JSON.parse(atob(savedToken.split('.')[1]))
        const expired = payload.exp && Date.now() / 1000 > payload.exp
        if (!expired) {
          const savedUser = JSON.parse(rawUser)
          if (savedUser && savedUser.email) {
            setCurrentUser(savedUser)
            setToken(savedToken)
            setIsAuthenticated(true)
            return
          }
        }
        // Token expired — clear everything and fall through to landing
        localStorage.removeItem('lv_current_user')
        localStorage.removeItem('lv_token')
      }
    } catch (_) {
      localStorage.removeItem('lv_current_user')
      localStorage.removeItem('lv_token')
    }

    // Restore auth view (login/signup/forgot) if user was on those pages
    try {
      const savedView = localStorage.getItem('lv_auth_view')
      if (savedView === 'login' || savedView === 'signup' || savedView === 'forgot') {
        setAuthView(savedView)
        return
      }
    } catch (_) {}

    // Default: landing page
    setAuthView('landing')
  }, [])

  // Keep last seen auth view in storage so refresh stays on same auth page
  useEffect(() => {
    if (!isAuthenticated) {
      try { localStorage.setItem('lv_auth_view', authView) } catch (_) {}
    }
  }, [authView, isAuthenticated])



  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable theme="dark" transition={Bounce} />
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        showLandingNav={authView === 'landing'}
      />
      <div className="[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
        <div className="min-h-[87vh]">
          {isAuthenticated ? (
            <Manager
              currentUser={currentUser}
              token={token}
              searchQuery={searchQuery}
            />
          ) : authView === "landing" ? (
            <LandingPage />
          ) : authView === "login" ? (
            <Login onSuccess={handleLoginSuccess} onSwitchToSignup={() => { setAuthView("signup"); try { localStorage.setItem('lv_auth_view', 'signup') } catch (_) {} }} onSwitchToForgot={() => { setAuthView("forgot"); try { localStorage.setItem('lv_auth_view', 'forgot') } catch (_) {} }} />
          ) : authView === "signup" ? (
            <Signup onSuccess={() => { setAuthView("login"); try { localStorage.setItem('lv_auth_view', 'login') } catch (_) {} }} onSwitchToLogin={() => { setAuthView("login"); try { localStorage.setItem('lv_auth_view', 'login') } catch (_) {} }} />
          ) : authView === "verified" ? (
            <VerifyEmailResult result={verifyResult} onGoToLogin={() => { setAuthView("login"); try { localStorage.setItem('lv_auth_view', 'login') } catch (_) {} }} />
          ) : (
            <ForgotPassword onSwitchToLogin={() => { setAuthView("login"); try { localStorage.setItem('lv_auth_view', 'login') } catch (_) {} }} />
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default App;