import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OtpVerificationForm from "../components/OtpVerificationForm";

interface OtpVerificationPageProps {
  email: string | null;
  onVerificationSuccess?: () => void;
}

const OtpVerificationPage: React.FC<OtpVerificationPageProps> = ({
  email,
  onVerificationSuccess,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar
        onNavigate={(sectionId) => {
          window.location.href = `/#${sectionId}`;
        }}
      />

      {/* Mini Hero Section */}
      <div className="bg-[#2C3E50] h-[240px] flex items-center justify-center">
        <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wider font-serif">
          Email Verification
        </h1>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-20 mb-16">
        <div className="max-w-[480px] mx-auto">
          <OtpVerificationForm
            email={email || ""}
            onBack={handleBack}
            onVerificationSuccess={onVerificationSuccess}
          />

          {/* Quick Links */}
          <div className="text-center text-sm space-y-2 mt-6">
            <div>
              <span className="text-gray-600">Return to </span>
              <a
                href="/"
                className="text-[#0077BE] underline hover:text-[#6B96C3]"
              >
                Home Page
              </a>
            </div>
            <div>
              <span className="text-gray-600">Already verified? </span>
              <a
                href="https://ebank.paynomadcapital.com/login"
                className="text-[#0077BE] underline hover:text-[#6B96C3]"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default OtpVerificationPage;
