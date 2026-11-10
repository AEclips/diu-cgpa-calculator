import React, { useState, useEffect } from 'react';
import { 
  X, 
  Target, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Calculator,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateTargetGpa } from '../utils/calculator';

export default function TargetGpaModal({
  isOpen,
  onClose,
  currentCgpa,
  completedCredits,
  activeScale
}) {
  const maxScale = activeScale?.maxGpa || 4.0;

  // Default target is either current + 0.2 or 3.75
  const [targetCgpa, setTargetCgpa] = useState(() => {
    const val = (parseFloat(currentCgpa) || 3.0) + 0.3;
    return Math.min(maxScale, Number(val.toFixed(2)));
  });

  const [remainingCredits, setRemainingCredits] = useState(30);

  // Update defaults when modal opens or stats change
  useEffect(() => {
    if (isOpen) {
      const cur = parseFloat(currentCgpa) || 3.0;
      const nextTarget = Math.min(maxScale, Number((cur + 0.25).toFixed(2)));
      setTargetCgpa(nextTarget);
    }
  }, [isOpen, currentCgpa, maxScale]);

  if (!isOpen) return null;

  const result = calculateTargetGpa({
    currentCgpa,
    completedCredits,
    targetCgpa,
    remainingCredits,
    maxScale
  });

  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">
                Target CGPA & What-If Planner
              </h3>
              <p className="text-xs text-emerald-100">
                Determine the exact future GPA needed to hit your graduation goal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-emerald-100 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Current Academic Standing Overview */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800/80">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Current Recorded CGPA
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {(parseFloat(currentCgpa) || 0).toFixed(2)}
                <span className="text-xs font-normal text-slate-400 ml-1">/ {maxScale.toFixed(1)}</span>
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Completed Credits
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {completedCredits || 0} <span className="text-xs font-normal text-slate-400">credits</span>
              </div>
            </div>
          </div>

          {/* User Target Inputs */}
          <div className="space-y-4">
            
            {/* Target CGPA slider & input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Desired Target Graduation CGPA:</span>
                </label>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {Number(targetCgpa).toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max={maxScale}
                step="0.05"
                value={targetCgpa}
                onChange={(e) => setTargetCgpa(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Min: 1.00</span>
                <span>Max: {maxScale.toFixed(2)}</span>
              </div>
            </div>

            {/* Remaining Credit Hours */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                  <Compass className="w-4 h-4 text-teal-500" />
                  <span>Remaining Credits to Complete:</span>
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    step="1"
                    value={remainingCredits}
                    onChange={(e) => setRemainingCredits(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-20 text-center bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-1 px-2 text-sm font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-xs text-slate-500">credits</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Typical semester is 15 credits. (e.g. 2 semesters left = ~30 credits)
              </p>
            </div>

          </div>

          {/* Calculation Feasibility Result */}
          {result.isValid && (
            <div className={`p-5 rounded-2xl border transition-all ${
              result.feasibility === 'impossible'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                : result.feasibility === 'hard'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
            }`}>
              
              <div className="flex items-start space-x-3">
                {result.feasibility === 'impossible' ? (
                  <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                )}

                <div className="flex-1">
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-75">
                      Required Future GPA Average:
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono">
                      {result.requiredGpa > 0 ? result.requiredGpa.toFixed(2) : '0.00'}
                      <span className="text-sm font-normal opacity-70"> / {maxScale.toFixed(1)}</span>
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-medium mt-2 leading-relaxed">
                    {result.message}
                  </p>

                  <div className="mt-4 pt-3 border-t border-current/10 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="opacity-75">Max Achievable CGPA:</span>
                      <div className="font-bold font-mono text-sm">{result.maxPossibleCgpa.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="opacity-75">Total Degree Credits:</span>
                      <div className="font-bold font-mono text-sm">{completedCredits + remainingCredits} cr</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCelebrate}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate Plan 🎉</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs sm:text-sm hover:opacity-90 transition"
          >
            Done
          </button>
        </div>

      </div>

    </div>
  );
}
