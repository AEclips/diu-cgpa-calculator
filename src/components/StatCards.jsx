import React, { useEffect, useState } from 'react';
import { Award, BookCheck, TrendingUp, Sparkles, Percent, Layers } from 'lucide-react';

export default function StatCards({ stats, activeScale }) {
  const {
    cgpa,
    cgpaDisplay,
    totalCredits,
    passedCredits,
    totalQualityPoints,
    percentage,
    academicStanding
  } = stats;

  const [isPulsing, setIsPulsing] = useState(false);

  // Trigger smooth score animation whenever CGPA changes
  useEffect(() => {
    setIsPulsing(true);
    const t = setTimeout(() => setIsPulsing(false), 450);
    return () => clearTimeout(t);
  }, [cgpaDisplay, totalCredits]);

  const maxGpa = activeScale?.maxGpa || 4.0;
  const progressRatio = maxGpa > 0 ? Math.min(100, Math.max(0, (cgpa / maxGpa) * 100)) : 0;

  const getBadgeColorClasses = (colorName) => {
    switch (colorName) {
      case 'emerald':
        return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 shadow-emerald-500/10';
      case 'green':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/40 text-green-700 dark:text-green-300 shadow-green-500/10';
      case 'blue':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300 shadow-blue-500/10';
      case 'amber':
        return 'from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-amber-500/10';
      case 'rose':
        return 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-700 dark:text-rose-300 shadow-rose-500/10';
      default:
        return 'from-slate-500/20 to-slate-600/20 border-slate-500/40 text-slate-700 dark:text-slate-300';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* Primary CGPA Hero Card (Frosted with Radiant Gradient) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/90 via-teal-600/90 to-emerald-800/90 backdrop-blur-xl border border-white/20 text-white p-6 sm:p-7 shadow-2xl shadow-emerald-950/20 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02]">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 rounded-full bg-white/20 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center space-x-1.5">
            <Award className="w-4 h-4" />
            <span>Cumulative CGPA</span>
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-semibold backdrop-blur-md border border-white/20">
            Scale: {maxGpa.toFixed(1)}
          </span>
        </div>

        <div className="my-4 flex items-baseline space-x-3 relative z-10">
          <div className={`text-4xl sm:text-5xl font-black tracking-tight font-mono transition-transform duration-300 ${isPulsing ? 'score-update' : ''}`}>
            {cgpaDisplay}
          </div>
          <div className="text-emerald-200 text-sm font-semibold">
            / {maxGpa.toFixed(2)}
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="relative z-10">
          <div className="w-full bg-black/25 rounded-full h-2.5 overflow-hidden backdrop-blur-sm p-0.5">
            <div 
              className="bg-white h-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-white/50" 
              style={{ width: `${progressRatio}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-emerald-100 mt-1.5 font-medium">
            <span>Score Ratio</span>
            <span className="font-bold font-mono">{progressRatio.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Total Credits Card (Frosted Glass Panel) */}
      <div className="glass-panel p-6 sm:p-7 flex flex-col justify-between hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <BookCheck className="w-4 h-4 text-emerald-500" />
            <span>Total Credit Hours</span>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/50 dark:border-emerald-800/50">
            Earned: {passedCredits}
          </span>
        </div>

        <div className="my-3">
          <div className={`text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight ${isPulsing ? 'score-update' : ''}`}>
            {totalCredits} <span className="text-lg font-normal text-slate-500 dark:text-slate-400">credits</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {totalCredits > 0 
              ? `${stats.semesterStats.length} semester(s) recorded` 
              : 'Add courses below to begin'}
          </p>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>Standard degree: ~140-148 credits</span>
        </div>
      </div>

      {/* Quality Points Card */}
      <div className="glass-panel p-6 sm:p-7 flex flex-col justify-between hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <TrendingUp className="w-4 h-4 text-teal-500" />
            <span>Quality Points</span>
          </span>
          <span className="text-xs px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200/50 dark:border-teal-800/50">
            Credits × GP
          </span>
        </div>

        <div className="my-3">
          <div className={`text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-mono ${isPulsing ? 'score-update' : ''}`}>
            {totalQualityPoints}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cumulative weighted score
          </p>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          {percentage !== null ? (
            <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center space-x-1">
              <Percent className="w-3.5 h-3.5" />
              <span>Equivalent: {percentage}%</span>
            </span>
          ) : (
            <span>Formula: Σ(Credit × Grade Point)</span>
          )}
        </div>
      </div>

      {/* Academic Standing & Honors Card */}
      <div className="glass-panel p-6 sm:p-7 flex flex-col justify-between hover:scale-[1.01]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Academic Standing</span>
          </span>
        </div>

        <div className="my-3">
          {academicStanding ? (
            <div className={`p-3.5 rounded-2xl bg-gradient-to-r border font-bold text-sm sm:text-base shadow-sm ${getBadgeColorClasses(academicStanding.color)}`}>
              <div className="text-base sm:text-lg">{academicStanding.badge}</div>
              <div className="text-xs font-medium opacity-90 mt-0.5">{academicStanding.label}</div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-medium">
              Add course grades to view your honors status
            </div>
          )}
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Graduation Status</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">Active</span>
        </div>
      </div>

    </div>
  );
}
