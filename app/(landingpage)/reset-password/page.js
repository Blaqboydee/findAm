"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setMessage("Invalid reset link");
      setMessageType("error");
      setValidatingToken(false);
      return;
    }

    // Validate token with backend
    fetch(`/api/auth/validate-reset-token?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setTokenValid(true);
        } else {
          setMessage(data.error || "Invalid or expired reset link");
          setMessageType("error");
        }
      })
      .catch(() => {
        setMessage("Failed to validate reset link");
        setMessageType("error");
      })
      .finally(() => {
        setValidatingToken(false);
      });
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("Resetting password...");
    setMessageType("");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Password reset successful! Redirecting...");
        setMessageType("success");

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setMessage(data.error || "Failed to reset password");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  // Validating token
  if (validatingToken) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  // Invalid token
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-3">
            Invalid Reset Link
          </h2>
          <p className="text-neutral-600 mb-6">{message}</p>
          <Link
            href="/"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-8 rounded-t-2xl">
          <div className="flex items-center gap-3 mb-2">
            <KeyRound className="w-7 h-7" />
            <h2 className="text-2xl md:text-3xl font-bold">Reset Password</h2>
          </div>
          <p className="text-neutral-100 text-sm">Enter your new password</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-800">
              New Password
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

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-neutral-800">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full pl-12 pr-12 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary transition-colors text-neutral-900 bg-neutral-50 focus:bg-white"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
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
                Resetting...
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5" />
                Reset Password
              </>
            )}
          </button>

          {/* Back Link */}
          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}