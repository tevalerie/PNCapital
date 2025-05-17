import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SignupForm from "../components/SignupForm";

interface SignupPageProps {
  setVerifyingEmail?: (email: string) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ setVerifyingEmail }) => {
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
          Create Your Account
        </h1>
      </div>

      {/* Form Card */}
      <div className="container mx-auto px-4 -mt-20 mb-16">
        <div className="max-w-[480px] mx-auto">
          <SignupForm setVerifyingEmail={setVerifyingEmail} />

          {/* Quick Links */}
          <div className="text-center text-sm space-y-2 mt-6">
            <div>
              <span className="text-gray-600">Already have an account? </span>
              <a
                href="https://ebank.paynomadcapital.com/signin"
                className="text-[#0077BE] underline hover:text-[#6B96C3]"
              >
                Sign In
              </a>
            </div>
            <div className="flex justify-center flex-wrap gap-4 pt-2">
              <a href="/#about" className="text-[#0077BE] hover:text-[#6B96C3]">
                About Us
              </a>
              <a
                href="/#services"
                className="text-[#0077BE] hover:text-[#6B96C3]"
              >
                Services
              </a>
              <a
                href="/#insights"
                className="text-[#0077BE] hover:text-[#6B96C3]"
              >
                Insights
              </a>
              <a
                href="/#contact"
                className="text-[#0077BE] hover:text-[#6B96C3]"
              >
                Contact
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

export default SignupPage;
