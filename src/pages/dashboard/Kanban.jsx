import React from 'react';

const KanbanComingSoon = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">
          Coming <span className="text-blue-600">Soon.</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-md mx-auto">
          Our Kanban board is currently moving through the pipeline. We're almost at the Finish line.
        </p>
      </div>

      {/* Visual Kanban Teaser */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        
        {/* Column 1: Done */}
        <div className="bg-slate-200/50 rounded-xl p-4 border-2 border-dashed border-slate-300">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">✔ Completed</h2>
          <div className="space-y-3 opacity-60">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="h-2 w-12 bg-green-400 rounded mb-2"></div>
              <div className="h-3 w-full bg-slate-100 rounded"></div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="h-2 w-16 bg-green-400 rounded mb-2"></div>
              <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
            </div>
          </div>
        </div>

        {/* Column 2: In Progress */}
        <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 ring-4 ring-blue-100/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-4 flex justify-between">
            <span>🚀 In Progress</span>
            <span className="animate-pulse">●</span>
          </h2>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500 transform -rotate-1">
              <div className="h-2 w-20 bg-blue-400 rounded mb-2"></div>
              <p className="text-sm font-medium text-slate-700">Polishing Drag & Drop UI</p>
              <div className="mt-4 flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                <div className="w-6 h-6 rounded-full bg-blue-300 border-2 border-white"></div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="h-2 w-12 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 w-full bg-slate-50 rounded"></div>
            </div>
          </div>
        </div>

        {/* Column 3: Coming Soon */}
        <div className="bg-slate-200/50 rounded-xl p-4 border-2 border-dashed border-slate-300">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">⏳ Next Up</h2>
          <div className="space-y-3">
            <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 flex items-center justify-center">
               <span className="text-slate-400 text-sm font-medium italic">Final Deployment</span>
            </div>
          </div>
        </div>
      </div>

    
    </div>
  );
};

export default KanbanComingSoon;