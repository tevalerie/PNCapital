import { Routes, Route, Navigate } from "react-router-dom";
import { useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import Home from "./components/home";
import SignupPage from "./pages/SignupPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";
import { useState, useEffect, ReactNode } from "react";

// RequireEmailForOtp component to guard the OTP verification route
interface RequireEmailForOtpProps {
  children: ReactNode;
  verifyingEmail: string | null;
}

const RequireEmailForOtp = ({
  children,
  verifyingEmail,
}: RequireEmailForOtpProps) => {
  if (!verifyingEmail) {
    return <Navigate to="/register" replace />;
  }
  return <>{children}</>;
};

function App() {
  // Initialize verifyingEmail from sessionStorage
  const [verifyingEmail, setVerifyingEmail] = useState<string | null>(() => {
    return sessionStorage.getItem("verifyingEmail");
  });

  // Function to update verifyingEmail in state and sessionStorage
  const handleSetVerifyingEmail = (email: string) => {
    setVerifyingEmail(email);
    sessionStorage.setItem("verifyingEmail", email);
  };

  // Function to clear verifyingEmail from state and sessionStorage
  const clearVerifyingEmail = () => {
    setVerifyingEmail(null);
    sessionStorage.removeItem("verifyingEmail");
  };

  return (
    <>
      {/* For the tempo routes */}
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/register"
          element={<SignupPage setVerifyingEmail={handleSetVerifyingEmail} />}
        />
        <Route
          path="/verify"
          element={
            <RequireEmailForOtp verifyingEmail={verifyingEmail}>
              <OtpVerificationPage
                email={verifyingEmail}
                onVerificationSuccess={clearVerifyingEmail}
              />
            </RequireEmailForOtp>
          }
        />
        {/* Add more routes as needed */}

        {/* Add this before the catchall route */}
        {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}
      </Routes>
    </>
  );
}

export default App;
