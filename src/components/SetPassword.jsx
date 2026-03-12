import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export default function SetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [sessionError, setSessionError] = useState(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event, session);

        if (
          event === "INITIAL_SESSION" ||
          event === "SIGNED_IN" ||
          event === "PASSWORD_RECOVERY"
        ) {
          if (session) {
            setSessionReady(true);
          } else {
            setSessionError("Invalid or expired invite link. Please ask to be re-invited.");
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSetPassword = async () => {
    if (!password) {
      alert("Please enter a password");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      alert(error.message);
      console.error(error);
    } else {
      alert("Password set successfully. You can now log in.");
      window.location.href = "/auth";
    }
  };

  // ── Error state ──────────────────────────────────────────
  if (sessionError) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
        <div className={`p-8 rounded-2xl border max-w-md w-full text-center backdrop-blur-xl
          ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? "text-white" : "text-black"}`}>
            Invite Error
          </h2>
          <p className={`text-sm mb-6 ${isDark ? "text-white/60" : "text-black/60"}`}>
            {sessionError}
          </p>
          <button
            onClick={() => window.location.href = "/auth"}
            className={`px-6 py-2.5 rounded-xl font-medium text-sm transition
              ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Loading / verifying state ────────────────────────────
  if (!sessionReady) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
            Verifying invite link...
          </p>
        </div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────
  return (
    <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center p-4 relative overflow-hidden
      ${isDark ? "bg-black" : "bg-white"}`}>

      {/* Animated background blobs — matches your app style */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-10 -left-10 w-72 h-72 rounded-full blur-3xl animate-pulse
          ${isDark ? "bg-white/5" : "bg-black/5"}`} />
        <div className={`absolute bottom-10 -right-10 w-72 h-72 rounded-full blur-3xl animate-pulse
          ${isDark ? "bg-white/5" : "bg-black/5"}`}
          style={{ animationDelay: "1s" }} />
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-4 right-4 z-50 p-2 rounded-lg backdrop-blur-xl transition border
          ${isDark ? "bg-white/10 hover:bg-white/20 border-white/20" : "bg-black/10 hover:bg-black/20 border-black/20"}`}
      >
        <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
      </button>

      {/* Card */}
      <div className={`relative z-10 w-full max-w-md backdrop-blur-xl rounded-2xl border shadow-2xl overflow-hidden
        ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/10"}`}>

        {/* Card header */}
        <div className={`p-8 border-b ${isDark ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`w-9 h-9 bg-gradient-to-br from-white to-gray-800 rounded-xl flex items-center justify-center shadow-lg`}>
              <span className={`font-bold text-lg ${isDark ? "text-black" : "text-white"}`}>S</span>
            </div>
            <span className={`text-xl font-bold ${isDark ? "text-white" : "text-black"}`}>SpendDock</span>
          </div>

          <h2 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-black"}`}>
            Set Your Password
          </h2>
          <p className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
            You've been invited to SpendDock. Create a password to activate your account.
          </p>
        </div>

        {/* Card body */}
        <div className="p-8 space-y-5">

          {/* Password field */}
          <div>
            <label className={`block text-xs font-medium mb-1.5
              ${isDark ? "text-white/80" : "text-black/80"}`}>
              New Password
            </label>
            <input
              type="password"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2.5 rounded-lg backdrop-blur-xl border text-sm transition
                focus:outline-none focus:ring-1
                ${isDark
                  ? "bg-white/10 border-white/20 text-white placeholder-white/40 focus:ring-white/50"
                  : "bg-black/10 border-black/20 text-black placeholder-black/40 focus:ring-black/50"
                }`}
            />
          </div>

          {/* Confirm password field */}
          <div>
            <label className={`block text-xs font-medium mb-1.5
              ${isDark ? "text-white/80" : "text-black/80"}`}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetPassword()}
              className={`w-full px-3 py-2.5 rounded-lg backdrop-blur-xl border text-sm transition
                focus:outline-none focus:ring-1
                ${isDark
                  ? "bg-white/10 border-white/20 text-white placeholder-white/40 focus:ring-white/50"
                  : "bg-black/10 border-black/20 text-black placeholder-black/40 focus:ring-black/50"
                }`}
            />
          </div>

          {/* Password strength hint */}
          {password.length > 0 && (
            <p className={`text-xs ${password.length >= 8 ? "text-green-400" : "text-yellow-400"}`}>
              {password.length >= 8 ? "✓ Password length is good" : `${8 - password.length} more characters needed`}
            </p>
          )}

          {/* Submit button */}
          <button
            onClick={handleSetPassword}
            disabled={loading}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm transition transform hover:scale-[1.02] mt-2
              ${isDark
                ? "bg-white text-black hover:shadow-xl hover:shadow-white/20"
                : "bg-black text-white hover:shadow-xl hover:shadow-black/20"
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              "Activate Account →"
            )}
          </button>

        </div>
      </div>
    </div>
  );
}