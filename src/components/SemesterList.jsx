import React from 'react';
import { Plus, Expand, Shrink, BookOpen, Layers } from 'lucide-react';
import SemesterCard from './SemesterCard';

export default function SemesterList({
  semesters,
  activeScale,
  onAddSemester,
  onUpdateSemester,
  onDeleteSemester,
  onDuplicateSemester,
  onExpandAll,
  onCollapseAll
}) {
  return (
    <div className="space-y-6">
      
      {/* Section Header & Global Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Semesters & Course Records
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {semesters.length} semester{semesters.length === 1 ? '' : 's'} recorded • Live automatic calculation
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onExpandAll}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1"
            title="Expand all semesters"
          >
            <Expand className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Expand All</span>
          </button>

          <button
            onClick={onCollapseAll}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1"
            title="Collapse all semesters"
          >
            <Shrink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Collapse All</span>
          </button>

          <button
            onClick={onAddSemester}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs sm:text-sm font-bold flex items-center space-x-2 transition shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Semester</span>
          </button>
        </div>
      </div>

      {/* Empty State */}
      {semesters.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No Semesters Added
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mb-6">
            Get started by adding your first university semester, or click Demo Data in the top bar to preview sample courses.
          </p>
          <button
            onClick={onAddSemester}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Semester</span>
          </button>
        </div>
      ) : (
        /* Render All Semester Accordions */
        <div className="space-y-4">
          {semesters.map((sem, sIdx) => (
            <SemesterCard
              key={sem.id || sIdx}
              semester={sem}
              semesterIndex={sIdx}
              activeScale={activeScale}
              onUpdateSemester={(updated) => onUpdateSemester(sIdx, updated)}
              onDeleteSemester={() => onDeleteSemester(sIdx)}
              onDuplicateSemester={() => onDuplicateSemester(sIdx)}
            />
          ))}
        </div>
      )}

      {/* Bottom Add Semester Bar */}
      {semesters.length > 0 && (
        <div className="pt-2">
          <button
            onClick={onAddSemester}
            className="w-full py-3.5 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-sm flex items-center justify-center space-x-2 transition-all group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Add Another Semester (Semester {semesters.length + 1})</span>
          </button>
        </div>
      )}

    </div>
  );
}
