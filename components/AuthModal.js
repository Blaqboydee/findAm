"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { X, Mail, Lock, User, Loader2, CheckCircle2, AlertCircle, LogIn, UserPlus } from "lucide-react";
import Portal from "./Portal"; // ADD THIS

export default function AuthModal({ onClose }) {
  const { data: session } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messageType, setMessageType] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  useEffect(() => {
    if (session) onClose?.();
  }, [session, onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(isLogin ? "Logging in..." : "Creating your account...");
    setMessageType("");

    if (isLogin) {
      const res = await signIn("credentials", { 
        redirect: false, 
        email: form.email, 
        password: form.password 
      });
      
      setLoading(false);
      if (res?.error) {
        setMessage("Invalid credentials. Please try again.");
        setMessageType("error");
      } else {
        setMessage("Welcome back! Redirecting...");
        setMessageType("success");
        setTimeout(() => onClose?.(), 1500);
      }
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      
      setLoading(false);
      if (data.success) {
        setMessage("Account created successfully! Please login.");
        setMessageType("success");
        setTimeout(() => {
          setIsLogin(true);
          setForm({ name: "", email: "", password: "" });
          setMessage("");
          setMessageType("");
        }, 2000);
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
        setMessageType("error");
      }
    }
  }

  return (
    <Portal>
      <div 
        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
        style={{ zIndex: 9999 }} // EXPLICIT Z-INDEX
        onClick={onClose} // Click outside to close
      >
        <div 
          className="bg-white rounded-2xl w-full max-w-md relative shadow-2xl animate-slideUp"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button 
            className="absolute right-4 top-4 p-2 hover:bg-neutral-100 rounded-full transition-colors group z-10"
            onClick={onClose}
            type="button"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-neutral-600 group-hover:text-neutral-900 transition-colors" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-8 rounded-t-2xl">
            <div className="flex items-center gap-3 mb-2">
              {isLogin ? (
                <LogIn className="w-7 h-7" />
              ) : (
                <UserPlus className="w-7 h-7" />
              )}
              <h2 className="text-2xl md:text-3xl font-bold">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
            </div>
            <p className="text-neutral-100 text-sm">
              {isLogin 
                ? "Sign in to access your dashboard" 
                : "Join FindAm to grow your business"
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Name Field (Sign Up Only) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-neutral-800">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                    required
                  />
                </div>
              </div>
            )}

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

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-neutral-800">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                  required
                  minLength={6}
                />
              </div>
              {!isLogin && (
                <p className="text-xs text-neutral-600 ml-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

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
                {messageType === "success" && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                {messageType === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                {!messageType && <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />}
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary text-white py-3.5 rounded-xl font-bold hover:bg-secondary-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {isLogin ? (
                    <>
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </button>

            {/* Toggle Login/Signup */}
            <div className="text-center pt-4 border-t border-neutral-200">
              <p className="text-sm text-neutral-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage("");
                  setMessageType("");
                  setForm({ name: "", email: "", password: "" });
                }}
                className="text-primary font-semibold hover:text-primary-dark transition-colors mt-1"
              >
                {isLogin ? "Sign up for free" : "Sign in here"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </Portal>
  );
}