import React, { useState, useEffect } from "react";
import "./App.css";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { BrowserRouter, Navigate, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import AuthButton from "./shared/components/AuthButton/AuthButton";
import { JwtContext } from "./shared/contexts/JwtContext";
import RequireAuth from "./shared/components/RequireAuth/RequireAuth";
import LoginPage from "./pages/LoginPage/LoginPage";
import HelloUser from "./pages/UsersPage/HelloUser";
import jwt_decode from "jwt-decode";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function AppContent() {
  const [jwt, setJwt] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    console.log("Encoded JWT ID Token" + response.credential);
    let userObject = jwt_decode(response.credential);
    console.log(userObject);

    localStorage.setItem("token", response.credential);
    localStorage.setItem("name", JSON.stringify(userObject.name));
    localStorage.setItem("email_verified", JSON.stringify(userObject.email_verified));

    setJwt(response.credential);
    setUser(userObject);

    navigate('/hello-user');
  }

  function handleStorageChange(event) {
    if (event.key === "token") {
      setJwt(localStorage.getItem("token") || null);
    }
  }

  function initGoogleOneTap() {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }

  useEffect(() => {
    if (window.google && window.google.accounts) {
      initGoogleOneTap();
    } else {
      window.addEventListener("google-loaded", initGoogleOneTap);
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("google-loaded", initGoogleOneTap);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!jwt) {
      initGoogleOneTap();
    }
  }, [jwt]);

  return (
    <JwtContext.Provider value={{ jwt, setJwt }}>
      <div className="App">
        <div className="App-header">
          <AuthButton />

          <nav className="form-nav">
            {!jwt && <NavLink className="b-btn" to="/register">Register</NavLink>}
            {!jwt && <NavLink className="b-btn" to="/login">Login</NavLink>}
          </nav>

          <Routes>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/hello-user" element={<HelloUser />} />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>

          {!jwt && <div id="signInDiv"></div>}
        </div>
      </div>
    </JwtContext.Provider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
