import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import LandingPage from "./components/LandingPage";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authView, setAuthView] = useState("landing")
  const [currentUser, setCurrentUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleLoginSuccess = (user) => {
    setCurrentUser(user || null)
    setIsAuthenticated(true)
    // Persist current user session
    try {
      if (user) {
        localStorage.setItem('lv_current_user', JSON.stringify(user))
      }
    } catch (_) {}
  }

  const handleLogout = () => {
    localStorage.removeItem('lv_current_user')
    sessionStorage.removeItem('lv_page_loaded')
    setCurrentUser(null)
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
      if (rawUser) {
        const savedUser = JSON.parse(rawUser)
        if (savedUser && savedUser.email) {
          setCurrentUser(savedUser)
          setIsAuthenticated(true)
          return
        }
      }
    } catch (_) {
      localStorage.removeItem('lv_current_user')
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
              searchQuery={searchQuery}
            />
          ) : authView === "landing" ? (
            <LandingPage />
          ) : authView === "login" ? (
            <Login onSuccess={handleLoginSuccess} onSwitchToSignup={() => { setAuthView("signup"); try { localStorage.setItem('lv_auth_view', 'signup') } catch (_) {} }} onSwitchToForgot={() => { setAuthView("forgot"); try { localStorage.setItem('lv_auth_view', 'forgot') } catch (_) {} }} />
          ) : authView === "signup" ? (
            <Signup onSuccess={() => { setAuthView("login"); try { localStorage.setItem('lv_auth_view', 'login') } catch (_) {} }} onSwitchToLogin={() => { setAuthView("login"); try { localStorage.setItem('lv_auth_view', 'login') } catch (_) {} }} />
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
