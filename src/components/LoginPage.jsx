import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, googleProvider } from "../firebaseConfig"; 
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Adjust back to "/" if your route is strictly "/"
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/home"); // Adjust back to "/" if your route is strictly "/"
    } catch (err) {
      console.error("Google Auth error:", err);
      setError("Failed to log in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
<main className="min-h-screen bg-[url('/kitchen-bg.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center p-4 selection:bg-[#8BAE66] selection:text-white font-sans">      <div className="w-full max-w-md bg-white/70 backdrop-blur-xl rounded-[32px] border border-white p-8 sm:p-10 shadow-2xl shadow-[#628141]/10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Logo */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#628141] text-white shadow-xl shadow-[#628141]/20">
          <span className="text-3xl font-black tracking-tighter">Me</span>
        </div>
        
        <div className="text-center mt-6 mb-8">
          <h1 className="text-3xl font-black text-[#1B211A]">Welcome Back</h1>
          <p className="mt-2 text-sm font-bold text-[#1B211A]/60">
            Log in to access your recipe vault.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#1B211A]/90 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="chef@example.com"
              className="w-full rounded-xl border border-[#628141]/20 bg-[#EBD5AB]/20 px-4 py-3.5 text-[#1B211A] focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition placeholder:text-[#1B211A]/40"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-[#1B211A]/90 mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#628141]/20 bg-[#EBD5AB]/20 px-4 py-3.5 text-[#1B211A] focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition placeholder:text-[#1B211A]/40"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-4 w-full rounded-xl px-4 py-4 text-sm font-bold text-white shadow-lg transition ${
              isLoading 
                ? "bg-[#1B211A]/50 cursor-not-allowed" 
                : "bg-[#628141] hover:bg-[#1B211A] hover:scale-[1.02] shadow-[#628141]/30"
            }`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center w-full mt-8 border-t border-[#1B211A]/10">
          <span className="absolute px-4 bg-[#F2E5D0] text-[#1B211A]/50 text-xs font-bold uppercase tracking-widest rounded-full">Or</span>
        </div>

        {/* Google Sign-In Button */}
        <button 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 mt-8 text-sm font-bold text-[#1B211A] bg-white/60 border border-[#628141]/20 rounded-xl hover:bg-[#EBD5AB]/40 transition shadow-sm"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Log in with Google
        </button>

        <p className="mt-8 text-center text-sm font-semibold text-[#1B211A]/70">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#628141] hover:text-[#1B211A] font-bold transition">
            Sign up here
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;