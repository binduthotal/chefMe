import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import { updateEmail } from "firebase/auth";

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: "",
    surname: "",
    email: "",
    bio: "",
    signatureCuisine: "",
    createdAt: null
  });

  useEffect(() => {
    if (!user) return;

    const userRef = ref(db, `users/${user.uid}`);
    
    // Listen for the user's profile data
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfileData({
          name: data.name || "",
          surname: data.surname || "",
          email: data.email || user.email, // Fallback to auth email
          bio: data.bio || "",
          signatureCuisine: data.signatureCuisine || "",
          createdAt: data.createdAt || null
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // 1. Update Firebase Authentication Email (if changed)
      if (profileData.email !== user.email) {
        await updateEmail(user, profileData.email);
      }

      // 2. Update Realtime Database Profile
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        name: profileData.name,
        surname: profileData.surname,
        email: profileData.email, 
        bio: profileData.bio,
        signatureCuisine: profileData.signatureCuisine
      });
      
      setIsEditing(false);
      
    } catch (error) {
      console.error("Error saving profile:", error);
      
      // Catch specific Firebase Auth errors for a better UX
      if (error.code === 'auth/requires-recent-login') {
        alert("For security reasons, please log out and log back in to change your email address.");
      } else if (error.code === 'auth/email-already-in-use') {
        alert("This email is already in use by another account.");
      } else if (error.code === 'auth/invalid-email') {
        alert("Please enter a valid email address.");
      } else {
        alert("Failed to update profile. Please try again.");
      }
      
    } finally {
      setIsSaving(false);
    }
  };

  // Helper to format the join date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Get initials for the avatar (combining first and last name if available)
  const initials = `${profileData.name?.charAt(0) || ""}${profileData.surname?.charAt(0) || ""}`.toUpperCase() || "CH";

  return (
    <div className="mt-6 max-w-3xl animate-in fade-in zoom-in-95 duration-200">
      
      <div className="bg-white rounded-[28px] border border-indigo-100 shadow-sm overflow-hidden">
        
        {/* Profile Header/Cover */}
        <div className="h-32 bg-[linear-gradient(135deg,rgba(139,92,246,0.8),rgba(99,102,241,0.8),rgba(56,189,248,0.8))] relative">
          <div className="absolute -bottom-12 left-8 border-4 border-white rounded-3xl bg-indigo-950 h-24 w-24 flex items-center justify-center text-3xl font-black text-white shadow-lg">
            {initials}
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="pt-16 px-8 pb-8">
          {!isEditing ? (
            // --- VIEW MODE ---
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900">
                  {profileData.name} {profileData.surname}
                </h2>
                <p className="text-indigo-500 font-medium mt-1">{profileData.email}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Signature Cuisine</h3>
                  <p className="text-slate-800 font-medium bg-slate-50 px-4 py-2 rounded-xl inline-block border border-slate-100">
                    {profileData.signatureCuisine || "Not set yet"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Member Since</h3>
                  <p className="text-slate-800 font-medium px-4 py-2">
                    {formatDate(profileData.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">The Chef's Story</h3>
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-50">
                  <p className="text-slate-700 leading-relaxed">
                    {profileData.bio || "No bio added yet. Click 'Edit Profile' to share your culinary journey!"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // --- EDIT MODE ---
            <form onSubmit={handleSaveProfile} className="space-y-5 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">First Name</label>
                  <input required type="text" name="name" value={profileData.name} onChange={handleInputChange} className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Last Name</label>
                  <input type="text" name="surname" value={profileData.surname} onChange={handleInputChange} placeholder="E.g. Sharma" className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
                </div>
              </div>

             <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={profileData.email} 
                  onChange={handleInputChange} 
                  placeholder="e.g., bindu@example.com"
                  className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Signature Cuisine / Specialty</label>
                <input type="text" name="signatureCuisine" value={profileData.signatureCuisine} onChange={handleInputChange} placeholder="E.g. South Indian, Baking, Comfort Food" className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Bio / Your Story</label>
                <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows="4" placeholder="Tell us about your cooking journey..." className="w-full rounded-xl border border-indigo-100 px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition ${isSaving ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/30'}`}>
                  {isSaving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;