import React, { useState } from "react";
import { useNavigate, NavLink, Outlet } from "react-router-dom"; // <-- ADDED NavLink and Outlet
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import Footer from "./Footer";

// We update menuItems to include the actual URL paths
const menuItems = [
  { name: "Dashboard", path: "/" },
  { name: "Recipes", path: "/recipes" },
  { name: "Shopping List", path: "/shopping-list" },
  { name: "Favorites", path: "/favorites" },
  { name: "Your Profile", path: "/profile" },
];

const Home = () => {
  const navigate = useNavigate();
  // Notice: activeTab state is completely gone!
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[url('/kitchen-bg.jpg')] bg-cover bg-center bg-fixed text-[#1B211A] font-sans selection:bg-[#8BAE66] selection:text-white flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-[#628141]/20 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4 sm:gap-8">
            
            <div className="flex items-center gap-3 shrink-0 cursor-pointer group" onClick={() => navigate("/")}>
              <img src="/logo.svg" alt="Me Chef Logo" className="h-10 w-10 object-cover rounded-xl shadow-md shadow-[#628141]/20 transition-transform duration-300 group-hover:scale-105" />
              <span className="text-xl font-black tracking-tight text-[#1B211A]">Chef</span>
            </div>

            {/* --- DESKTOP NAVIGATION --- */}
            <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"} // 'end' ensures Dashboard doesn't stay highlighted on other pages
                  className={({ isActive }) =>
                    `cursor-pointer px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#628141] text-white shadow-md shadow-[#628141]/30"
                        : "text-[#1B211A]/70 hover:bg-[#8BAE66]/20 hover:text-[#1B211A]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 shrink-0">
              <button onClick={handleLogout} className="cursor-pointer p-2 text-[#1B211A]/50 hover:text-[#1B211A] hover:bg-[#1B211A]/10 rounded-full transition" title="Logout">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            {/* Mobile Nav Toggle */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer p-2 text-[#1B211A] focus:outline-none">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE DROPDOWN MENU --- */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 right-4 w-56 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-4 border border-[#EBD5AB]/50 flex flex-col gap-2 z-50">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `cursor-pointer text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive ? "bg-[#628141] text-white" : "text-[#1B211A]/80 hover:bg-[#EBD5AB]/40"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
            <hr className="border-[#EBD5AB] my-2" />
            <button onClick={handleLogout} className="cursor-pointer text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition">
              Logout
            </button>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-grow w-full">
        {/* THIS IS WHERE THE MAGIC HAPPENS! */}
        {/* React Router will automatically inject Dashboard, Recipes, or Profile here based on the URL */}
        <Outlet />
      </div>
      
      <Footer />
    </main>
  );
};

export default Home;