// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6">
      <div className="text-center max-w-sm animate-scale-in">
        <div className="w-20 h-20 bg-burgundy/8 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <span className="font-display font-bold text-4xl text-burgundy/30">404</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-burgundy mb-3">Page Not Found</h1>
        <p className="text-burgundy/50 mb-8 text-sm leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-burgundy hover:underline">
            <ArrowLeft size={14} /> Home
          </Link>
          <span className="text-burgundy/20">|</span>
          <Link to="/student/login" className="flex items-center gap-2 px-4 py-2 bg-burgundy text-cream rounded-xl text-sm font-semibold hover:bg-burgundy-700 transition-all shadow-sm">
            <Shield size={14} /> Login
          </Link>
        </div>
      </div>
    </div>
  );
}