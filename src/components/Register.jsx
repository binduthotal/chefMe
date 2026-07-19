import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db, googleProvider } from '../firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // Standard Email/Password Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      await set(ref(db, `users/${user.uid}`), {
        name: name,
        email: email,
        createdAt: Date.now()
      });
      
      navigate('/'); 
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-Up
  const handleGoogleSignUp = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists in DB so we don't overwrite their data
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await set(userRef, {
          name: user.displayName,
          email: user.email,
          createdAt: Date.now()
        });
      }
      
      navigate('/');
    } catch (err) {
      console.error("Google Auth error:", err);
      setError('Failed to sign up with Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Me Chef</h2>
          <p className="mt-2 text-sm text-gray-500">Start preserving your culinary heritage today.</p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegister}>
          {/* ... Name, Email, and Password inputs remain exactly the same ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
            <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors" placeholder="Chef Bindu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors" placeholder="chef@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={isLoading} className={`w-full px-4 py-2 text-white font-semibold rounded-lg transition-colors ${isLoading ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="relative flex items-center justify-center w-full mt-6 border-t border-gray-300">
          <span className="absolute px-3 bg-white text-gray-500 text-sm">Or</span>
        </div>

        <button 
          onClick={handleGoogleSignUp} 
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 mt-4 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Sign up with Google
        </button>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-orange-600 hover:text-orange-500 hover:underline">
            Log in here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;