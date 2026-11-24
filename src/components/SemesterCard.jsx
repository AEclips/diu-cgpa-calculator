import React from 'react';
import { ChevronDown, Copy, Trash2, Plus } from 'lucide-react';
import CourseRow from './CourseRow';
import { calculateSemesterStats } from '../utils/calculator';
import useAnimatedNumber from '../hooks/useAnimatedNumber';

export default function SemesterCard({
  semester,
  activeScale,
  onUpdate,
  onDelete,
  onDuplicate
}) {
  const semStats = calculateSemesterStats(semester, activeScale);
  const animatedSgpa = useAnimatedNumber(semStats.sgpa || 0, 300);
  const sgpaDisplay = semStats.credits > 0 ? animatedSgpa.toFixed(2) : '0.00';
  const isCollapsed = Boolean(semester.collapsed);

  const handleToggleCollapse = () => {
    onUpdate({ ...semester, collapsed: !isCollapsed });
  };

  const handleRename = (name) => {
    onUpdate({ ...semester, name });
  };

  const handleCourseUpdate = (courseIdx, updatedCourse) => {
    const nextCourses = [...semester.courses];
    nextCourses[courseIdx] = updatedCourse;
    onUpdate({ ...semester, courses: nextCourses });
  };

  const handleCourseRemove = (courseIdx) => {
    const nextCourses = semester.courses.filter((_, idx) => idx !== courseIdx);
    onUpdate({ ...semester, courses: nextCourses });
  };

  const handleAddCourse = () => {
    const nextCourse = {
      id: 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      code: '',
      title: '',
      credits: 3.0,
      grade: '',
      isRetake: false
    };
    onUpdate({
      ...semester,
      collapsed: false,
      courses: [...semester.courses, nextCourse]
    });
  };

  return (
    <article className="surface-card animate-soft-enter">
      {/* Semester Header */}
      <div className="px-3.5 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between gap-1.5 sm:gap-3">
        <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
          <button
            type="button"
            onClick={handleToggleCollapse}
            aria-expanded={!isCollapsed}
            aria-label={isCollapsed ? 'Expand semester' : 'Collapse semester'}
            className="tactile-press w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? '-rotate-90' : ''}`}
              strokeWidth={1.75}
            />
          </button>

          <input
            type="text"
            value={semester.name}
            onChange={(e) => handleRename(e.target.value)}
            aria-label="Semester name"
            className="flex-1 min-w-0 text-[13px] sm:text-[15px] font-semibold tracking-[-0.01em] px-1.5 sm:px-2 py-1 rounded-lg bg-transparent border border-transparent hover:border-[var(--border-hairline)] focus:bg-[var(--bg-subtle)] focus:border-[var(--accent)] focus:outline-none transition-colors"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {/* Semester Summary & Actions */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          <span
            className="hidden sm:inline text-xs font-medium tabular-nums"
            style={{ color: 'var(--text-tertiary)' }}
          >
            {semStats.courseCount} {semStats.courseCount === 1 ? 'course' : 'courses'} · {semStats.credits} cr
          </span>

          <span
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold tabular-nums whitespace-nowrap"
            style={{
              backgroundColor: 'var(--accent-soft)',
              color: 'var(--accent)'
            }}
          >
            SGPA {sgpaDisplay}
          </span>

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={onDuplicate}
              aria-label="Duplicate semester"
              title="Duplicate semester"
              className="tactile-press w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors opacity-55 hover:opacity-100 hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Copy className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={onDelete}
              aria-label="Delete semester"
              title="Delete semester"
              className="tactile-press w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors opacity-55 hover:opacity-100 hover:bg-[var(--danger-soft)] hover:text-[var(--danger)]"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {/* Course Table Body */}
      {!isCollapsed && (
        <div className="border-t" style={{ borderColor: 'var(--border-hairline)' }}>
          {semester.courses.length > 0 && (
            <div
              className="hidden sm:flex items-center justify-between px-6 py-2 text-[11px] font-medium uppercase tracking-wider border-b"
              style={{
                color: 'var(--text-tertiary)',
                borderColor: 'var(--border-hairline)',
                backgroundColor: 'var(--bg-subtle)'
              }}
            >
              <span>Course</span>
              <div className="flex items-center gap-3 pr-9">
                <span className="w-[84px] text-center">Credits</span>
                <span className="w-[104px] text-center">Grade</span>
                <span className="w-11 text-right">Pts</span>
              </div>
            </div>
          )}

          {semester.courses.length === 0 ? (
            <div
              className="px-6 py-8 text-center text-xs"
              style={{ color: 'var(--text-tertiary)' }}
            >
              No courses in this semester yet. Add a course below to start calculating SGPA.
            </div>
          ) : (
            <div className="[&>*+*]:border-t [&>*+*]:border-[var(--border-hairline)]">
              {semester.courses.map((course, idx) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  activeScale={activeScale}
                  onUpdate={(updated) => handleCourseUpdate(idx, updated)}
                  onRemove={() => handleCourseRemove(idx)}
                />
              ))}
            </div>
          )}

          {/* Add Course Footer */}
          <div className="border-t" style={{ borderColor: 'var(--border-hairline)' }}>
            <button
              type="button"
              onClick={handleAddCourse}
              className="tactile-press w-full py-2.5 px-6 rounded-b-[20px] flex items-center justify-center gap-1.5 text-xs font-medium transition-colors hover:bg-[var(--bg-subtle)]"
              style={{ color: 'var(--accent)' }}
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
              <span>Add course</span>
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
