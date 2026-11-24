import React, { useState, useRef, useEffect } from 'react';
import { Minus, Plus, X, ChevronDown, Check } from 'lucide-react';
import { getGradePoints } from '../utils/calculator';

function getGradeDotColor(points, maxGpa) {
  const ratio = maxGpa > 0 ? points / maxGpa : 0;
  if (ratio >= 0.9) return 'var(--positive)';
  if (ratio >= 0.75) return 'var(--accent)';
  if (ratio >= 0.5) return 'var(--warning)';
  return 'var(--danger)';
}

export default function CourseRow({ course, activeScale, onUpdate, onRemove }) {
  const [gradeMenuOpen, setGradeMenuOpen] = useState(false);
  const gradeRef = useRef(null);

  const maxGpa = activeScale?.maxGpa || 4.0;
  const credits = parseFloat(course.credits) || 0;
  const gradePoints = getGradePoints(course.grade, activeScale);
  const qualityPoints = credits * gradePoints;

  useEffect(() => {
    if (!gradeMenuOpen) return;
    const handleClickOutside = (e) => {
      if (gradeRef.current && !gradeRef.current.contains(e.target)) {
        setGradeMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setGradeMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [gradeMenuOpen]);

  const adjustCredits = (delta) => {
    const next = Math.min(12, Math.max(0.5, Number((credits + delta).toFixed(1))));
    onUpdate({ ...course, credits: next });
  };

  const currentGradeObj =
    activeScale.grades.find(
      (g) => g.letter.toUpperCase() === String(course.grade || '').trim().toUpperCase()
    ) || activeScale.grades[0];

  const activeDotColor = getGradeDotColor(currentGradeObj?.points ?? 0, maxGpa);

  return (
    <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 transition-colors hover:bg-[var(--bg-subtle)]/50 focus-within:bg-[var(--bg-subtle)]/70 group">
      {/* Code + Title */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <input
          type="text"
          value={course.code || ''}
          onChange={(e) => onUpdate({ ...course, code: e.target.value })}
          placeholder="CODE"
          aria-label="Course code"
          className="w-20 shrink-0 font-mono-code text-xs font-medium uppercase px-2 py-1 rounded-md bg-transparent border border-transparent hover:border-[var(--border-hairline)] focus:bg-[var(--bg-surface)] focus:border-[var(--accent)] focus:outline-none transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        />

        <input
          type="text"
          value={course.title || ''}
          onChange={(e) => onUpdate({ ...course, title: e.target.value })}
          placeholder="Course title"
          aria-label="Course title"
          className="flex-1 min-w-0 text-sm font-medium px-2 py-1 rounded-md bg-transparent border border-transparent hover:border-[var(--border-hairline)] focus:bg-[var(--bg-surface)] focus:border-[var(--accent)] focus:outline-none transition-colors truncate"
          style={{ color: 'var(--text-primary)' }}
        />
      </div>

      {/* Controls: Credits Stepper, Grade Menu, Quality Points, Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 sm:gap-3 pl-2 sm:pl-0 shrink-0">
        {/* Credits Pill Stepper */}
        <div
          className="inline-flex items-center rounded-full border h-7"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-hairline)'
          }}
        >
          <button
            type="button"
            onClick={() => adjustCredits(-0.5)}
            disabled={credits <= 0.5}
            aria-label="Decrease credits"
            className="tactile-press w-6 h-full flex items-center justify-center rounded-l-full transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Minus className="w-3 h-3" strokeWidth={2} />
          </button>
          <span
            className="w-9 text-center text-xs font-medium tabular-nums select-none"
            style={{ color: 'var(--text-primary)' }}
          >
            {credits.toFixed(1)}
          </span>
          <button
            type="button"
            onClick={() => adjustCredits(0.5)}
            disabled={credits >= 12}
            aria-label="Increase credits"
            className="tactile-press w-6 h-full flex items-center justify-center rounded-r-full transition-colors hover:bg-[var(--bg-hover)] disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Plus className="w-3 h-3" strokeWidth={2} />
          </button>
        </div>

        {/* Grade Pill Popover */}
        <div className="relative" ref={gradeRef}>
          <button
            type="button"
            onClick={() => setGradeMenuOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={gradeMenuOpen}
            aria-label="Course grade"
            className="tactile-press inline-flex items-center justify-between gap-1.5 px-2.5 h-7 min-w-[104px] rounded-full border text-xs font-semibold tabular-nums whitespace-nowrap transition-colors hover:bg-[var(--bg-hover)]"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-hairline)',
              color: 'var(--text-primary)'
            }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: activeDotColor }}
              />
              <span>
                {currentGradeObj ? `${currentGradeObj.letter} (${currentGradeObj.points.toFixed(2)})` : 'Grade'}
              </span>
            </span>
            <ChevronDown
              className={`w-3 h-3 shrink-0 transition-transform duration-150 ${
                gradeMenuOpen ? 'rotate-180' : ''
              }`}
              style={{ color: 'var(--text-tertiary)' }}
              strokeWidth={1.75}
            />
          </button>

          {gradeMenuOpen && (
            <div
              role="listbox"
              aria-label="Select course grade"
              className="absolute right-0 mt-1.5 w-36 max-h-60 overflow-y-auto p-1 rounded-2xl border z-40 animate-soft-enter"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-hairline)',
                boxShadow: 'var(--shadow-modal)'
              }}
            >
              {activeScale.grades.map((g) => {
                const isSelected = g.letter === currentGradeObj?.letter;
                const dotColor = getGradeDotColor(g.points, maxGpa);
                return (
                  <button
                    key={g.letter}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onUpdate({ ...course, grade: g.letter });
                      setGradeMenuOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between gap-2 tabular-nums transition-colors hover:bg-[var(--bg-subtle)]"
                    style={{
                      color: isSelected ? 'var(--accent)' : 'var(--text-primary)'
                    }}
                  >
                    <span className="inline-flex items-center gap-1.5 font-semibold">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: dotColor }}
                      />
                      <span>{g.letter}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span style={{ color: isSelected ? 'var(--accent)' : 'var(--text-tertiary)' }}>
                        {g.points.toFixed(2)}
                      </span>
                      {isSelected && <Check className="w-3 h-3" strokeWidth={2.25} />}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Quality Points */}
        <span
          className="w-11 text-right text-xs font-medium tabular-nums"
          style={{ color: 'var(--text-tertiary)' }}
          title="Quality points"
        >
          {qualityPoints.toFixed(2)}
        </span>

        {/* Remove Course */}
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove course"
          title="Remove course"
          className="tactile-press w-6 h-6 rounded-full flex items-center justify-center transition-colors opacity-45 hover:opacity-100 hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] focus-visible:opacity-100"
          style={{ color: 'var(--text-tertiary)' }}
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}
