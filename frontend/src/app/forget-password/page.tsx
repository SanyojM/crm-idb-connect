"use client";

import { useState } from "react";
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ForgetPasswordPage() {
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!otpRequested) {
        const res = await fetch("http://localhost:5005/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Failed to send OTP");
        setOtpRequested(true);
      } else {
        const res = await fetch("http://localhost:5005/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        if (!res.ok) throw new Error("Invalid or expired OTP");
        setOtpVerified(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5005/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      if (!res.ok) throw new Error("Failed to reset password");
      setResetSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center flex flex-col items-center">
          <img src="/logo.gif" alt="" className="w-3/4 h-full rounded-lg" />
          <h1 className="text-3xl font-bold text-gray-900">
            {resetSuccess ? "All Set" : otpVerified ? "New Password" : "Reset Password"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {resetSuccess
              ? "Your password has been reset."
              : otpVerified
              ? "Choose a new password"
              : otpRequested
              ? "Enter the OTP sent to your email"
              : "We'll send an OTP to your registered email"}
          </p>
        </div>

        {resetSuccess ? (
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-white hover:cursor-pointer"
            >
              Back to Sign In <ArrowRight size={20} />
            </Link>
          </div>
        ) : !otpVerified ? (
          <form onSubmit={handleSubmit} className="space-y-5 mt-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={otpRequested}
                placeholder="Email Address"
                className="w-full rounded-lg border border-gray-200 p-3 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-60"
              />
            </div>

            {otpRequested && (
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  autoFocus
                  placeholder="Enter OTP"
                  className="w-full rounded-lg border border-gray-200 p-3 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-center font-medium text-white hover:cursor-pointer disabled:opacity-50"
            >
              {loading ? "Please wait..." : otpRequested ? "Verify OTP" : "Send OTP"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-5 mt-5">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                autoFocus
                placeholder="New Password"
                className="w-full rounded-lg border border-gray-200 p-3 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Re-enter New Password"
                className="w-full rounded-lg border border-gray-200 p-3 pl-10 text-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-center font-medium text-white hover:cursor-pointer disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset Password"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        )}

        {!resetSuccess && (
          <div className="flex justify-center w-full mt-4 text-sm">
            <Link href="/login" className="hover:text-blue-400">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}