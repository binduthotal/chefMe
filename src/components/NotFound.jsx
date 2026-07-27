import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[url('/kitchen-bg.jpg')] bg-cover bg-center bg-fixed flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-[32px] border border-white p-8 sm:p-12 shadow-xl max-w-lg w-full text-center">
        
        {/* Icon */}
        <div className="text-6xl mb-6">🍽️</div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-[#1B211A] mb-4">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-[#628141] mb-4">
          Recipe Not Found
        </h2>
        <p className="text-[#1B211A]/70 mb-8">
          Oops! Looks like someone took a bite out of this page. The link you clicked might be broken or the page may have been removed.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-[#628141] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#628141]/30 transition hover:bg-[#1B211A] hover:scale-[1.02] w-full sm:w-auto"
        >
          Back to Kitchen
        </button>
      </div>
    </div>
  );
};

export default NotFound;