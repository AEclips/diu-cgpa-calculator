import React from 'react';
import { BarChart3, PieChart, Activity } from 'lucide-react';

export default function TrendChart({ semesterStats, activeScale, gradeDistribution }) {
  const maxGpa = activeScale?.maxGpa || 4.0;
  const hasSemesters = semesterStats && semesterStats.length > 0;

  // Grade breakdown entries sorted by grade point descending
  const gradeKeys = Object.keys(gradeDistribution || {});
  const totalGradedCourses = Object.values(gradeDistribution || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Semester GPA Trend (2 Cols on lg) */}
      <div className="lg:col-span-2 glass-panel rounded-2xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              Semester GPA Progression
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Scale: 0.0 – {maxGpa.toFixed(1)}
          </span>
        </div>

        {!hasSemesters || semesterStats.every(s => s.credits === 0) ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <BarChart3 className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
            <span>Add semesters and courses to visualize your GPA trend over time</span>
          </div>
        ) : (
          <div className="pt-4">
            <div className="grid grid-flow-col auto-cols-fr gap-3 sm:gap-6 items-end h-48 px-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {semesterStats.map((sem, idx) => {
                const heightPercent = maxGpa > 0 ? (sem.sgpa / maxGpa) * 100 : 0;
                const isTopScore = sem.sgpa >= (maxGpa * 0.875);

                return (
                  <div key={sem.semesterId || idx} className="flex flex-col items-center h-full justify-end group relative">
                    
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[11px] py-1 px-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-20">
                      <span className="font-bold">{sem.semesterName}</span>: {sem.sgpaDisplay} SGPA ({sem.credits} cr)
                    </div>

                    {/* Score value above bar */}
                    <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 transition group-hover:text-emerald-500">
                      {sem.sgpaDisplay}
                    </span>

                    {/* Bar column */}
                    <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800/80 rounded-t-xl overflow-hidden h-36 flex items-end p-0.5">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
                          isTopScore 
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md shadow-emerald-500/20' 
                            : 'bg-gradient-to-t from-teal-600 to-emerald-500'
                        }`}
                        style={{ height: `${Math.max(4, heightPercent)}%` }}
                      />
                    </div>

                    {/* Semester label under bar */}
                    <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 mt-2 truncate w-full text-center">
                      Sem {idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grade Distribution Overview (1 Col on lg) */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-teal-500" />
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base">
              Grade Distribution
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {totalGradedCourses} course(s)
          </span>
        </div>

        {totalGradedCourses === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-slate-400 text-xs text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <PieChart className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
            <span>Grade breakdown will appear here</span>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {gradeKeys.map((grade) => {
              const count = gradeDistribution[grade];
              const pct = Math.round((count / totalGradedCourses) * 100);
              
              return (
                <div key={grade} className="text-xs">
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-6 py-0.5 rounded text-center bg-slate-200 dark:bg-slate-700 text-[11px] font-bold">
                        {grade}
                      </span>
                      <span className="font-normal text-slate-500 dark:text-slate-400">
                        {count} course{count > 1 ? 's' : ''}
                      </span>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          Showing count and proportion across all enrolled semesters.
        </div>
      </div>

    </div>
  );
}
