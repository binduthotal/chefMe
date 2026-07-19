import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig'; 
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); 
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      console.error("Google Auth error:", err);
      setError('Failed to log in with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Me Chef</h2>
          <p className="mt-2 text-sm text-gray-500">Log in to access your saved recipes.</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleLogin}>
           {/* ... Email and Password inputs remain exactly the same ... */}
           <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors" placeholder="chef@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition-colors ${isLoading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="relative flex items-center justify-center w-full mt-6 border-t border-gray-300">
          <span className="absolute px-3 bg-white text-gray-500 text-sm">Or</span>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Log in with Google
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-orange-600 hover:text-orange-500 hover:underline">
            Sign up here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;