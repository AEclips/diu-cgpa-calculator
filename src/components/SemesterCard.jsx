import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Copy, 
  Edit3, 
  Check, 
  GraduationCap,
  Layers,
  BookOpen
} from 'lucide-react';
import CourseRow from './CourseRow';
import { calculateSemesterStats } from '../utils/calculator';

export default function SemesterCard({
  semester,
  semesterIndex,
  activeScale,
  onUpdateSemester,
  onDeleteSemester,
  onDuplicateSemester
}) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(semester.name);

  const stats = calculateSemesterStats(semester, activeScale);
  const maxGpa = activeScale?.maxGpa || 4.0;
  const isCollapsed = semester.collapsed ?? false;

  const toggleCollapse = () => {
    onUpdateSemester({
      ...semester,
      collapsed: !isCollapsed
    });
  };

  const handleSaveName = () => {
    setIsEditingName(false);
    onUpdateSemester({
      ...semester,
      name: tempName.trim() || `Semester ${semesterIndex + 1}`
    });
  };

  const handleAddCourse = () => {
    const newCourse = {
      id: 'c-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
      code: `CS ${(semesterIndex + 1) * 100 + (semester.courses.length + 1) * 10}`,
      title: 'New Course',
      credits: 3,
      grade: activeScale?.grades?.[0]?.letter || 'A',
      isRetake: false
    };

    onUpdateSemester({
      ...semester,
      collapsed: false,
      courses: [...(semester.courses || []), newCourse]
    });
  };

  const handleUpdateCourse = (courseIndex, updatedCourse) => {
    const newCourses = [...semester.courses];
    newCourses[courseIndex] = updatedCourse;
    onUpdateSemester({
      ...semester,
      courses: newCourses
    });
  };

  const handleDeleteCourse = (courseIndex) => {
    const newCourses = semester.courses.filter((_, idx) => idx !== courseIndex);
    onUpdateSemester({
      ...semester,
      courses: newCourses
    });
  };

  // Score badge tone
  const getSgpaTone = (sgpa) => {
    const ratio = maxGpa > 0 ? sgpa / maxGpa : 0;
    if (ratio >= 0.875) return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    if (ratio >= 0.75) return 'bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-800';
    if (ratio >= 0.6) return 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
    if (ratio >= 0.5) return 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    return 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800';
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden transition-all duration-200 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700">
      
      {/* Semester Header Card */}
      <div className="px-4 sm:px-6 py-4 bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left Side: Collapse toggle & Name editor */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleCollapse}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition"
            title={isCollapsed ? "Expand Semester" : "Collapse Semester"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          {isEditingName ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                autoFocus
                className="bg-white dark:bg-slate-900 border border-emerald-500 rounded-lg px-2.5 py-1 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
              />
              <button
                onClick={handleSaveName}
                className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 group cursor-pointer" onClick={() => setIsEditingName(true)}>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
                {semester.name}
              </h3>
              <Edit3 className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>

        {/* Right Side: SGPA Badge, Credits, and Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Credits Counter */}
          <div className="flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{stats.credits} Credits</span>
          </div>

          {/* SGPA Score Badge */}
          <div className={`flex items-center space-x-1.5 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-xl border shadow-sm ${getSgpaTone(stats.sgpa)}`}>
            <span>SGPA:</span>
            <span className="font-mono text-sm sm:text-base">{stats.sgpaDisplay}</span>
          </div>

          {/* Duplicate Semester */}
          <button
            onClick={onDuplicateSemester}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/50 transition"
            title="Duplicate Semester"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Delete Semester */}
          <button
            onClick={onDeleteSemester}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            title="Delete Semester"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Accordion Body (Courses Table) */}
      {!isCollapsed && (
        <div className="p-3 sm:p-5">
          {(!semester.courses || semester.courses.length === 0) ? (
            <div className="py-8 text-center flex flex-col items-center justify-center">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                No courses added to this semester yet.
              </p>
              <button
                onClick={handleAddCourse}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Course</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 dark:border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                    <th className="py-2 px-3 text-center w-10">#</th>
                    <th className="py-2 px-3">Course Code & Title</th>
                    <th className="py-2 px-3 w-36">Credit Hours</th>
                    <th className="py-2 px-3 w-40">Grade</th>
                    <th className="py-2 px-3 text-right hidden md:table-cell w-28">Quality Pts</th>
                    <th className="py-2 px-3 text-center w-12">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {semester.courses.map((course, cIdx) => (
                    <CourseRow
                      key={course.id || cIdx}
                      index={cIdx}
                      course={course}
                      activeScale={activeScale}
                      onUpdate={(updated) => handleUpdateCourse(cIdx, updated)}
                      onDelete={() => handleDeleteCourse(cIdx)}
                    />
                  ))}
                </tbody>
              </table>

              {/* Add Course Footer Action */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={handleAddCourse}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Add Course</span>
                </button>

                <div className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  Semester Quality Points: <span className="font-bold text-slate-700 dark:text-slate-300">{stats.qualityPoints}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
