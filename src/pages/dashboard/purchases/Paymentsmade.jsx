import React from 'react';
import { Lock, ArrowUpRight, CheckCircle2, DollarSign } from 'lucide-react'; // Optional: npm install lucide-react

const Paymentsmade = () => {
  return ( <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-slate-200">
      <div className="relative w-full max-w-4xl">
        
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative gap-12 items-center">
          
          {/* Left Side: Content */}
          <div className="space-y-8">
            <div className="inline-flex ml-60 items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xl  font-medium">
              <Lock size={14} />
              <span>Secure Transactions Coming Soon</span>
            </div>
            
           

          
          </div>

         

        </div>
      </div>
    </div>
   
  );
};

export default Paymentsmade;