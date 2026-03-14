import React, { useState } from 'react';
import { Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlphaGateProps {
  children: React.ReactNode;
}

const AlphaGate: React.FC<AlphaGateProps> = ({ children }) => {
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState(false);
  // Check for existing authorization in session
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return sessionStorage.getItem('alpha_access_granted') === 'true';
  });
  const [isLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validCode = import.meta.env.VITE_ALPHA_ACCESS_CODE || 'PLAID2026';
    if (accessCode.toUpperCase() === validCode.toUpperCase()) {
      sessionStorage.setItem('alpha_access_granted', 'true');
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (isLoading) return null;

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050B15]">
      {/* Magical Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 relative"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          {/* Decorative Gold Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-200" />
          
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Lock className="text-white w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center justify-center gap-2">
                Alpha Access <Sparkles className="w-5 h-5 text-amber-400" />
              </h1>
              <p className="text-slate-400 text-sm">
                This environment is strictly limited to authorized Founders and Testers. Please enter your access code to proceed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter Access Code"
                  className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all text-center tracking-[0.2em] font-mono`}
                />
                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-xs mt-2"
                    >
                      Invalid access code. Please check and try again.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-200 text-black font-bold py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-amber-500/10"
              >
                <ShieldCheck className="w-5 h-5" />
                Unlock Terminal
              </button>
            </form>

            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
              Castle Companion • Secure Node pdx1
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AlphaGate;
