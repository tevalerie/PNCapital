import { Routes, Route, Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Home from "./components/home";
import { useEffect } from "react";

function App() {
  // Handle external redirects
  useEffect(() => {
    // Check if the URL contains specific paths for redirection
    const path = window.location.pathname;
    if (path === "/register" || path === "/signup") {
      window.location.href = "https://ebank.paynomadcapital.com/signup";
    } else if (path === "/signin" || path === "/login") {
      window.location.href = "https://ebank.paynomadcapital.com/signin";
    }
  }, []);

  return (
    <>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Redirect routes */}
        <Route
          path="/register"
          element={
            <Navigate to="https://ebank.paynomadcapital.com/signup" replace />
          }
        />
        <Route
          path="/signup"
          element={
            <Navigate to="https://ebank.paynomadcapital.com/signup" replace />
          }
        />
        <Route
          path="/signin"
          element={
            <Navigate to="https://ebank.paynomadcapital.com/signin" replace />
          }
        />
        <Route
          path="/login"
          element={
            <Navigate to="https://ebank.paynomadcapital.com/signin" replace />
          }
        />

        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

        {/* Catchall route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
