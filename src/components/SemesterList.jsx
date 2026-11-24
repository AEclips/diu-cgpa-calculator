import React from 'react';
import { Plus, RotateCcw, Sparkles } from 'lucide-react';
import SemesterCard from './SemesterCard';

export default function SemesterList({
  semesters,
  activeScale,
  onAddSemester,
  onUpdateSemester,
  onDeleteSemester,
  onDuplicateSemester,
  onLoadSampleData,
  onResetData
}) {
  return (
    <section aria-label="Semesters">
      {/* Clean Toolbar */}
      <div className="flex items-center justify-between gap-2 mb-4 px-1">
        <h2
          className="text-base font-semibold tracking-[-0.015em] shrink-0"
          style={{ color: 'var(--text-primary)' }}
        >
          Semesters
        </h2>

        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onLoadSampleData}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Sparkles className="w-3 h-3 shrink-0" strokeWidth={1.75} />
            <span>Sample</span>
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <RotateCcw className="w-3 h-3 shrink-0" strokeWidth={1.75} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={onAddSemester}
            className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-medium text-white whitespace-nowrap shrink-0 transition-colors"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent)')}
          >
            <Plus className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />
            <span className="hidden sm:inline">Add Semester</span>
            <span className="sm:hidden">Semester</span>
          </button>
        </div>
      </div>

      {/* Semester Cards */}
      <div className="space-y-5">
        {semesters.map((semester, index) => (
          <SemesterCard
            key={semester.id}
            semester={semester}
            activeScale={activeScale}
            onUpdate={(updated) => onUpdateSemester(index, updated)}
            onDelete={() => onDeleteSemester(index)}
            onDuplicate={() => onDuplicateSemester(index)}
          />
        ))}
      </div>
    </section>
  );
}
