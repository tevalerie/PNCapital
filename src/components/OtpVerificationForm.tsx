import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface OtpVerificationFormProps {
  email?: string;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  onBack?: () => void;
  onVerificationSuccess?: () => void;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({
  email = "",
  onVerify,
  onResend,
  onBack,
  onVerificationSuccess,
}) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and limit to 6 digits
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Make API call to verify OTP
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp,
      });

      console.log("OTP verification response:", response.data);

      // Call the onVerify callback if provided
      if (onVerify) {
        onVerify(otp);
      }

      // Show success message
      setSuccessMessage("Email verified successfully! Redirecting...");

      // Call onVerificationSuccess to clear email from sessionStorage
      if (onVerificationSuccess) {
        onVerificationSuccess();
      }

      // Redirect to the URL provided by the backend after a delay
      if (response.data.redirectUrl) {
        setTimeout(() => {
          window.location.href = response.data.redirectUrl;
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setError(
        error.response?.data?.message ||
          "Failed to verify code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(60);
    setError(null);

    try {
      // Make API call to resend OTP
      const response = await axios.post(`${API_BASE_URL}/submit-application`, {
        email,
      });

      console.log("OTP resend response:", response.data);

      // Show success message
      setSuccessMessage("A new verification code has been sent to your email.");

      // Clear success message after a few seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      if (onResend) {
        onResend();
      }
    } catch (error: any) {
      console.error("Error resending OTP:", error);
      setError(
        error.response?.data?.message ||
          "Failed to resend code. Please try again.",
      );
      // Reset the countdown if there was an error
      setCanResend(true);
      setCountdown(0);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-[#2c3e50] mb-6 text-center">
        Verify Your Email
      </h2>

      {successMessage ? (
        <div className="text-center p-4 bg-green-50 rounded-md text-green-700 mb-4">
          {successMessage}
        </div>
      ) : (
        <>
          <p className="text-center text-gray-600 mb-6">
            We've sent a verification code to{" "}
            <span className="font-medium">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                value={otp}
                onChange={handleChange}
                className={error ? "border-red-500" : ""}
                placeholder="Enter 6-digit code"
                inputMode="numeric"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || otp.length !== 6}
              className="w-full bg-[#0077BE] text-white uppercase tracking-wider py-3 rounded-lg font-medium hover:bg-[#6B96C3] transition-colors"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>

            <div className="flex justify-between items-center">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-[#0077BE] hover:underline text-sm"
                >
                  Back to email entry
                </button>
              )}

              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend}
                className={`text-sm ${canResend ? "text-[#0077BE] hover:underline" : "text-gray-400"}`}
              >
                {canResend ? "Resend code" : `Resend code in ${countdown}s`}
              </button>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};

export default OtpVerificationForm;
