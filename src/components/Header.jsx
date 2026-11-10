import React from 'react';
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  Sparkles, 
  Sliders, 
  Target, 
  FileDown, 
  DatabaseBackup, 
  RotateCcw,
  BookOpen,
  Zap
} from 'lucide-react';
import { GRADING_SCALES } from '../constants/gradingScales';

export default function Header({
  activeScaleId,
  onScaleChange,
  customScales,
  onOpenScaleModal,
  onOpenTargetModal,
  onOpenPriorModal,
  onOpenExportModal,
  onLoadSampleData,
  onResetData,
  onBackup,
  onRestoreClick,
  darkMode,
  setDarkMode
}) {
  const allScales = {
    ...GRADING_SCALES,
    ...customScales
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-700 dark:from-white dark:via-emerald-300 dark:to-teal-400 bg-clip-text text-transparent">
                  UniGrade
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  BD & Global
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                DIU, BRAC, NSU & International University CGPA Calculator
              </p>
            </div>
          </div>

          {/* Scale Selector & Major Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Scale Picker */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800/90 rounded-xl p-1 border border-slate-200 dark:border-slate-700/80">
              <select
                value={activeScaleId}
                onChange={(e) => onScaleChange(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 px-2 py-1 focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[200px] truncate"
                title="Select Grading Scale"
              >
                <optgroup label="Academic Scales">
                  {Object.values(GRADING_SCALES).map((sc) => (
                    <option key={sc.id} value={sc.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      {sc.name}
                    </option>
                  ))}
                </optgroup>
                {Object.keys(customScales).length > 0 && (
                  <optgroup label="Custom Scales">
                    {Object.values(customScales).map((sc) => (
                      <option key={sc.id} value={sc.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        {sc.name} (Custom)
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              <button
                onClick={onOpenScaleModal}
                className="p-1.5 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Customize / Edit Grading Scale"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Prior CGPA Button */}
            <button
              onClick={onOpenPriorModal}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 transition shadow-sm"
              title="Quick Prior CGPA Estimator"
            >
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="hidden md:inline font-semibold">Prior GPA</span>
            </button>

            {/* Target CGPA Planner Button */}
            <button
              onClick={onOpenTargetModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 transition shadow-sm"
              title="Target CGPA Planner"
            >
              <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden md:inline font-semibold">Target Planner</span>
            </button>

            {/* Export PDF Button */}
            <button
              onClick={onOpenExportModal}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/60 transition shadow-sm"
              title="Export Transcript PDF"
            >
              <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden md:inline font-semibold">Transcript</span>
            </button>

            {/* Quick Actions Dropdown / Group */}
            <div className="hidden lg:flex items-center space-x-1 border-l border-slate-200 dark:border-slate-800 pl-2">
              <button
                onClick={onLoadSampleData}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1"
                title="Load DIU Sample Courses"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>DIU Demo</span>
              </button>

              <button
                onClick={onBackup}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Backup Data (JSON)"
              >
                <DatabaseBackup className="w-4 h-4" />
              </button>

              <button
                onClick={onResetData}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Reset All Semesters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
