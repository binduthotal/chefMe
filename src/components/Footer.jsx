import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-6 mt-auto border-t border-[#628141]/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        
        {/* Left Side: Copyright */}
        <p className="text-sm font-bold text-[#1B211A]/60 transition-colors hover:text-[#628141]">
          &copy; 2026 crafted by Bindu. All rights reserved.
        </p>
        <div className="hidden sm:block h-6 w-px bg-[#1B211A]/20"></div> 
        {/* Right Side: About Link */}
        <Link 
          to="/about" 
          className="text-sm font-bold right-0 text-[#1B211A]/60 hover:text-[#628141] transition-colors"
        >
          About 
        </Link>
        
      </div>
    </footer>
  );
};

export default Footer;