import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { ref, onValue, update } from "firebase/database";
import { updateEmail } from "firebase/auth";
import Footer from "./Footer";

const Profile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({ name: "", surname: "", email: "", bio: "", signatureCuisine: "", createdAt: null });

  useEffect(() => {
    if (!user) return;
    const userRef = ref(db, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProfileData({
          name: data.name || "", surname: data.surname || "", email: data.email || user.email,
          bio: data.bio || "", signatureCuisine: data.signatureCuisine || "", createdAt: data.createdAt || null
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
      if (profileData.email !== user.email) {
        await updateEmail(user, profileData.email);
      }
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, {
        name: profileData.name, surname: profileData.surname, email: profileData.email,
        bio: profileData.bio, signatureCuisine: profileData.signatureCuisine
      });
      setIsEditing(false);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') alert("For security reasons, please log out and log back in to change your email address.");
      else if (error.code === 'auth/email-already-in-use') alert("This email is already in use by another account.");
      else if (error.code === 'auth/invalid-email') alert("Please enter a valid email address.");
      else alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recently";
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#628141]"></div>
      </div>
    );
  }

  const initials = `${profileData.name?.charAt(0) || ""}${profileData.surname?.charAt(0) || ""}`.toUpperCase() || "CH";

  return (
    // ADDED 'mx-auto' HERE TO CENTER THE PROFILE DIV
    <div className="mt-6 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-[28px] border border-[#628141]/20 shadow-xl shadow-[#628141]/5 overflow-hidden">
        
        {/* Botanical Green Header */}
        <div className="h-32 bg-[#628141] relative">
          <div className="absolute -bottom-12 left-8 border-4 border-white rounded-3xl bg-[#EBD5AB] flex items-center justify-center h-24 w-24 text-3xl font-black text-[#1B211A] shadow-lg">
            {initials}
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="cursor-pointer absolute top-4 right-4 bg-black/20 hover:bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="pt-16 px-8 pb-8">
          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black text-[#1B211A]">{profileData.name} {profileData.surname}</h2>
                <p className="text-[#628141] font-bold mt-1">{profileData.email}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1B211A]/10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B211A]/50 mb-2">Signature Cuisine</h3>
                  <p className="text-[#1B211A] font-bold bg-[#EBD5AB]/30 px-4 py-2 rounded-xl inline-block border border-[#628141]/10">
                    {profileData.signatureCuisine || "Not set yet"}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B211A]/50 mb-2">Member Since</h3>
                  <p className="text-[#1B211A] font-bold px-4 py-2">
                    {formatDate(profileData.createdAt)}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1B211A]/50 mb-2">The Chef's Story</h3>
                <div className="bg-[#EBD5AB]/30 p-5 rounded-2xl border border-[#628141]/10">
                  <p className="text-[#1B211A]/80 leading-relaxed">
                    {profileData.bio || "No bio added yet. Click 'Edit Profile' to share your culinary journey!"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-5 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-[#1B211A]/90 mb-1">First Name</label>
                  <input required type="text" name="name" value={profileData.name} onChange={handleInputChange} className="w-full bg-[#EBD5AB]/20 text-[#1B211A] rounded-xl border border-[#628141]/20 px-4 py-2.5 focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#1B211A]/90 mb-1">Last Name</label>
                  <input type="text" name="surname" value={profileData.surname} onChange={handleInputChange} placeholder="E.g. Sharma" className="w-full bg-[#EBD5AB]/20 text-[#1B211A] rounded-xl border border-[#628141]/20 px-4 py-2.5 focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1B211A]/90 mb-1">Email Address</label>
                <input type="email" name="email" value={profileData.email} onChange={handleInputChange} className="w-full bg-[#EBD5AB]/20 text-[#1B211A] rounded-xl border border-[#628141]/20 px-4 py-2.5 focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1B211A]/90 mb-1">Signature Cuisine</label>
                <input type="text" name="signatureCuisine" value={profileData.signatureCuisine} onChange={handleInputChange} placeholder="E.g. South Indian, Baking" className="w-full bg-[#EBD5AB]/20 text-[#1B211A] rounded-xl border border-[#628141]/20 px-4 py-2.5 focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1B211A]/90 mb-1">Bio / Your Story</label>
                <textarea name="bio" value={profileData.bio} onChange={handleInputChange} rows="4" className="w-full bg-[#EBD5AB]/20 text-[#1B211A] rounded-xl border border-[#628141]/20 px-4 py-2.5 focus:border-[#628141] focus:ring-2 focus:ring-[#628141]/20 outline-none transition resize-none"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#1B211A]/10">
                <button type="button" onClick={() => setIsEditing(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#1B211A]/70 hover:bg-[#EBD5AB]/50 hover:text-[#1B211A] transition">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition ${isSaving ? 'bg-[#1B211A]/50' : 'bg-[#628141] hover:bg-[#1B211A]'}`}>
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