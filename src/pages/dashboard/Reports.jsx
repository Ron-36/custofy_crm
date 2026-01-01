import React from 'react';
import { BarChart3, PieChart, TrendingUp, Sparkles } from 'lucide-react';

const ReportsComingSoon = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 overflow-hidden">
      
     

      <div className="relative z-10 max-w-6xl w-full">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6 animate-bounce">
            <Sparkles size={16} />
            <span>AI-Powered Insights Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Your data, <span className="text-indigo-600 italic">visualized.</span>
          </h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto">
            We're building a powerful reporting suite to help you spot trends before they happen. Deep dives and custom exports are on the way.
          </p>
        </div>

       
        
      </div>

     
    </div>
  );
};

export default ReportsComingSoon;