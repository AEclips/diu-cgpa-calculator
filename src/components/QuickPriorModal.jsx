import React, { useState, useEffect } from 'react';
import { X, Zap, Layers, Calculator, TrendingUp } from 'lucide-react';
import { calculateQuickPrior } from '../utils/calculator';

export default function QuickPriorModal({
  isOpen,
  onClose,
  totalCredits,
  currentCgpa
}) {
  const [prevCredits, setPrevCredits] = useState(totalCredits || 60);
  const [prevCgpa, setPrevCgpa] = useState(currentCgpa || 3.65);
  const [curCredits, setCurCredits] = useState(15);
  const [curSgpa, setCurSgpa] = useState(3.85);

  useEffect(() => {
    if (isOpen) {
      if (totalCredits > 0) setPrevCredits(totalCredits);
      if (currentCgpa > 0) setPrevCgpa(currentCgpa);
    }
  }, [isOpen, totalCredits, currentCgpa]);

  if (!isOpen) return null;

  const result = calculateQuickPrior({
    prevCredits,
    prevCgpa,
    curCredits,
    curSgpa
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg">Quick Prior CGPA Estimator</h3>
              <p className="text-xs text-amber-100">Fast rolling calculation without re-entering old semesters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-amber-100 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Previous Completed Credits
              </label>
              <input
                type="number"
                min="0"
                max="250"
                value={prevCredits}
                onChange={(e) => setPrevCredits(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Previous Cumulative CGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={prevCgpa}
                onChange={(e) => setPrevCgpa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Current Term Credits
              </label>
              <input
                type="number"
                min="0.5"
                max="40"
                step="0.5"
                value={curCredits}
                onChange={(e) => setCurCredits(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Expected Current SGPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={curSgpa}
                onChange={(e) => setCurSgpa(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm font-bold text-teal-600 dark:text-teal-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Result Banner */}
          <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-center mt-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
              Updated Projected CGPA:
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-amber-600 dark:text-amber-400 my-1">
              {result.newCgpa.toFixed(2)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Total Degree Credits: <span className="font-bold text-slate-700 dark:text-slate-200">{result.totalCredits}</span> • Quality Points: <span className="font-bold text-slate-700 dark:text-slate-200">{result.totalQualityPoints}</span>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
