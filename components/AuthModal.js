"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  X,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  LogIn,
  Eye,
  EyeOff,
} from "lucide-react";
import Portal from "./Portal";

export default function AuthModal({ onClose }) {
  const { data: session, update } = useSession();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const router = useRouter();
  
  useEffect(() => {
    const handleEscape = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  useEffect(() => {
    if (session) onClose?.();
  }, [session, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("Signing in...");
    setMessageType("");

    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (res?.error) {
      setMessage("Invalid credentials. Please try again.");
      setMessageType("error");
    } else {
      setMessage("Welcome back!");
      setMessageType("success");

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    
    if (!form.email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("Sending reset link...");
    setMessageType("");

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Password reset link sent! Check your email.");
        setMessageType("success");
        setShowForgotPassword(false);
        
        // Close modal after 3 seconds
        setTimeout(() => {
          onClose?.();
        }, 3000);
      } else {
        setMessage(data.error || "Something went wrong");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to send reset link. Try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Portal>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
        style={{ zIndex: 9999 }}
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            className="absolute right-4 top-4 p-2 hover:bg-neutral-100 rounded-full transition-colors group z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-8 rounded-t-2xl">
            <div className="flex items-center gap-3 mb-2">
              <LogIn className="w-7 h-7" />
              <h2 className="text-2xl md:text-3xl font-bold">
                {showForgotPassword ? "Reset Password" : "Welcome Back"}
              </h2>
            </div>
            <p className="text-neutral-100 text-sm">
              {showForgotPassword 
                ? "Enter your email to receive a reset link" 
                : "Sign in to access your dashboard"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={showForgotPassword ? handleForgotPassword : handleSubmit} className="p-8 space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-800">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Password Field - Only show if NOT forgot password */}
            {!showForgotPassword && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    className="w-full pl-12 pr-12 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Link - Only show if NOT in forgot password mode */}
            {!showForgotPassword && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setMessage("");
                    setMessageType("");
                  }}
                  className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div
                className={`flex items-center gap-2 p-3 rounded-xl ${
                  messageType === "success"
                    ? "bg-green-50 text-green-700"
                    : messageType === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {messageType === "success" && (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {messageType === "error" && <AlertCircle className="w-5 h-5" />}
                {!messageType && <Loader2 className="w-5 h-5 animate-spin" />}
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {showForgotPassword ? "Sending..." : "Signing in..."}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {showForgotPassword ? "Send Reset Link" : "Sign In"}
                </>
              )}
            </button>

            {/* Back to Sign In - Only show if in forgot password mode */}
            {showForgotPassword && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setMessage("");
                    setMessageType("");
                  }}
                  className="text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
                >
                  ← Back to sign in
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </Portal>
  );
}