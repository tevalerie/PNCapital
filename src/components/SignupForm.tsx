import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface SignupFormProps {
  onSubmit?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    referralCode?: string;
  }) => void;
  setVerifyingEmail?: (email: string) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({
  onSubmit = () => {},
  setVerifyingEmail,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    referralCode: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const schema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address"),
    referralCode: z.string().optional(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate form data
      schema.parse(formData);

      setIsSubmitting(true);
      setFormErrors({});
      setApiError(null);

      // Submit data to API
      try {
        const response = await axios.post(
          `${API_BASE_URL}/submit-application`,
          formData,
        );

        console.log("API submission response:", response.data);

        // Call the onSubmit callback with the form data
        await onSubmit(formData);

        // Store email in sessionStorage and state for OTP verification page
        if (setVerifyingEmail) {
          setVerifyingEmail(formData.email);
        }

        // Navigate to verification page
        navigate("/verify");
      } catch (error: any) {
        console.error("API submission error:", error);
        setApiError(
          error.response?.data?.message ||
            "Failed to submit your registration. Please try again later.",
        );
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        console.error("Form submission error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-[#2C3E50] p-6 text-center">
        <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
        <p className="text-gray-300 mt-2">
          Join PayNomad Capital for exclusive financial services
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {apiError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {apiError}
            <button
              type="button"
              className="ml-2 underline text-sm font-medium"
              onClick={() => setApiError(null)}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`border-gray-300 focus:border-[#0077be] focus:ring-[#0077be] ${formErrors.firstName ? "border-red-500" : ""}`}
              placeholder="John"
            />
            {formErrors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700 font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`border-gray-300 focus:border-[#0077be] focus:ring-[#0077be] ${formErrors.lastName ? "border-red-500" : ""}`}
              placeholder="Doe"
            />
            {formErrors.lastName && (
              <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`border-gray-300 focus:border-[#0077be] focus:ring-[#0077be] ${formErrors.email ? "border-red-500" : ""}`}
            placeholder="your@email.com"
          />
          {formErrors.email && (
            <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="referralCode" className="text-gray-700 font-medium">
            Referral Code (Optional)
          </Label>
          <Input
            id="referralCode"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            className="border-gray-300 focus:border-[#0077be] focus:ring-[#0077be]"
            placeholder="Enter Referral Code"
          />
          {formErrors.referralCode && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.referralCode}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0077BE] hover:bg-[#6B96C3] text-white uppercase tracking-wider py-3 rounded-lg font-medium transition-colors"
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
                Processing...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SignupForm;
