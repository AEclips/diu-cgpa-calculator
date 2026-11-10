import React from 'react';
import { Trash2, Plus, Minus, Repeat } from 'lucide-react';
import { getGradePoints } from '../utils/calculator';

export default function CourseRow({
  course,
  index,
  activeScale,
  onUpdate,
  onDelete
}) {
  const points = getGradePoints(course.grade, activeScale);
  const credits = parseFloat(course.credits) || 0;
  const qualityPoints = (credits * points).toFixed(2);

  const handleCreditChange = (val) => {
    const num = Math.max(0, Math.min(20, parseFloat(val) || 0));
    onUpdate({ ...course, credits: num });
  };

  return (
    <tr className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group">
      
      {/* Index Number */}
      <td className="py-3 px-3 sm:px-4 text-xs font-semibold text-slate-400 text-center w-10">
        {index + 1}
      </td>

      {/* Course Code & Title */}
      <td className="py-2.5 px-3">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="e.g. CS 101"
            value={course.code || ''}
            onChange={(e) => onUpdate({ ...course, code: e.target.value })}
            className="w-full sm:w-28 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-slate-200"
          />
          <input
            type="text"
            placeholder="Course Title / Subject Name"
            value={course.title || ''}
            onChange={(e) => onUpdate({ ...course, title: e.target.value })}
            className="flex-1 bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-slate-200"
          />
        </div>
      </td>

      {/* Credit Hours with quick +/- buttons */}
      <td className="py-2.5 px-3 w-36">
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => handleCreditChange(Math.max(0.5, credits - 0.5))}
            className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="Decrease credit"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input
            type="number"
            min="0"
            max="30"
            step="0.5"
            value={course.credits}
            onChange={(e) => handleCreditChange(e.target.value)}
            className="w-14 text-center bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-lg py-1 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => handleCreditChange(credits + 0.5)}
            className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="Increase credit"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </td>

      {/* Grade Selector */}
      <td className="py-2.5 px-3 w-40">
        <div className="relative">
          <select
            value={course.grade}
            onChange={(e) => onUpdate({ ...course, grade: e.target.value })}
            className="w-full bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
          >
            {activeScale?.grades?.map((g) => (
              <option key={g.letter} value={g.letter} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                {g.letter} ({g.points.toFixed(1)} pts) - {g.label || ''}
              </option>
            ))}
          </select>
        </div>
      </td>

      {/* Quality Points Display */}
      <td className="py-2.5 px-3 text-right font-mono text-xs font-bold text-slate-700 dark:text-slate-300 hidden md:table-cell w-28">
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
          {qualityPoints}
        </span>
      </td>

      {/* Delete Action */}
      <td className="py-2.5 px-3 text-center w-12">
        <button
          onClick={onDelete}
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:text-slate-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          title="Remove Course"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </td>

    </tr>
  );
}
