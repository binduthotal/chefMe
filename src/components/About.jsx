import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const About = () => {
  return (
    <main className="min-h-screen bg-[#EBD5AB] flex flex-col font-sans selection:bg-[#8BAE66] selection:text-white">
      
      {/* Simplified Header for easy navigation */}
      <header className="w-full border-b border-[#628141]/20 bg-white/70 backdrop-blur-lg shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* 1. Changed to="/" here */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#628141] text-white font-black text-xl shadow-md shadow-[#628141]/20">
              Me
            </div>
            <span className="text-xl font-black tracking-tight text-[#1B211A]">Chef</span>
          </Link>
          
          {/* 2. Changed to="/" here */}
          <Link to="/" className="text-sm font-bold text-[#628141] hover:text-[#1B211A] transition">
            ← Back to Dashboard
          </Link>
          
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20 w-full animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white/70 backdrop-blur-xl rounded-[32px] border border-white p-8 sm:p-12 shadow-2xl shadow-[#628141]/5">
          
          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-[#628141] mb-2">Our Story</p>
            <h1 className="text-4xl sm:text-5xl font-black text-[#1B211A]">About Me Chef</h1>
          </div>
          
          <div className="space-y-6 text-[#1B211A]/80 leading-relaxed text-lg">
            <p>
              Welcome to <strong className="text-[#1B211A]">Me Chef</strong>, your personal digital vault for preserving culinary heritage. 
            </p>
            <p>
              Created by Bindu, this application was born out of a desire to document, save, and easily share the recipes that matter most. Whether it's a generations-old family secret, a festive feast, or a quick weekend experiment, Me Chef provides a beautifully organized space to keep your culinary journey alive.
            </p>
            <p>
              I believe that every recipe has a story, and this platform is designed to make sure those stories are never lost.
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 pt-8 border-t border-[#1B211A]/10">
            <h2 className="text-2xl font-black text-[#1B211A] mb-4">Get in Touch</h2>
            <p className="text-[#1B211A]/80 mb-6">
              Have a question, feedback, or a feature request? I'd love to hear from you.
            </p>
            <a 
              href="mailto:contact@mechef.com" 
              className="inline-flex items-center gap-2 rounded-xl bg-[#628141] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#628141]/30 transition hover:bg-[#1B211A] hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              Email Me
            </a>
          </div>

        </div>
      </div>

      {/* Footer handles its own positioning */}
      <Footer />
    </main>
  );
};

export default About;