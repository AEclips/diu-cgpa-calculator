import React, { useState } from 'react';
import { X, Sliders, Plus, Trash2, Check, RotateCcw, AlertTriangle } from 'lucide-react';
import { GRADING_SCALES } from '../constants/gradingScales';

export default function ScaleConfigModal({
  isOpen,
  onClose,
  activeScale,
  onSaveCustomScale
}) {
  const [scaleName, setScaleName] = useState(() => activeScale.name || 'Custom University Scale');
  const [maxGpa, setMaxGpa] = useState(() => activeScale.maxGpa || 4.0);
  const [grades, setGrades] = useState(() => 
    activeScale.grades?.map(g => ({ ...g })) || [
      { letter: 'A', points: 4.0, label: 'Excellent' },
      { letter: 'B', points: 3.0, label: 'Good' },
      { letter: 'C', points: 2.0, label: 'Pass' },
      { letter: 'F', points: 0.0, label: 'Fail' }
    ]
  );

  if (!isOpen) return null;

  const handleAddGrade = () => {
    setGrades([
      ...grades,
      { letter: 'B+', points: 3.5, label: 'Above Average' }
    ]);
  };

  const handleUpdateGrade = (index, field, val) => {
    const updated = [...grades];
    if (field === 'points') {
      updated[index][field] = parseFloat(val) || 0;
    } else {
      updated[index][field] = val;
    }
    setGrades(updated);
  };

  const handleDeleteGrade = (index) => {
    setGrades(grades.filter((_, idx) => idx !== index));
  };

  const handlePresetClone = (presetId) => {
    const preset = GRADING_SCALES[presetId];
    if (preset) {
      setScaleName(preset.name + ' (Custom)');
      setMaxGpa(preset.maxGpa);
      setGrades(preset.grades.map(g => ({ ...g })));
    }
  };

  const handleSave = () => {
    const customId = 'custom-' + Date.now();
    const newScale = {
      id: customId,
      name: scaleName.trim() || 'Custom Scale',
      maxGpa: parseFloat(maxGpa) || 4.0,
      description: 'User-configured custom grading scale',
      grades: grades
    };
    onSaveCustomScale(newScale);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 text-white flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">
                Grading Scale & Point Mapping Editor
              </h3>
              <p className="text-xs text-slate-400">
                Customize letter grades and point equivalents for your institution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Clone from preset quick bar */}
          <div>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Start from a Standard Preset:
            </span>
            <div className="flex flex-wrap gap-2">
              {Object.values(GRADING_SCALES).map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetClone(preset.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 transition"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Scale Meta Config */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Scale / Institution Name
              </label>
              <input
                type="text"
                value={scaleName}
                onChange={(e) => setScaleName(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Maximum GPA Scale
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="100"
                value={maxGpa}
                onChange={(e) => setMaxGpa(parseFloat(e.target.value) || 4.0)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          {/* Grade to Points Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Letter Grade to Point Mappings ({grades.length} grades)
              </span>
              <button
                onClick={handleAddGrade}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold flex items-center space-x-1 hover:bg-emerald-100 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Grade Row</span>
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-2.5 px-3 w-28">Letter Grade</th>
                    <th className="py-2.5 px-3 w-28">Grade Points</th>
                    <th className="py-2.5 px-3">Description / Honors Label</th>
                    <th className="py-2.5 px-3 text-center w-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {grades.map((grade, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={grade.letter}
                          onChange={(e) => handleUpdateGrade(idx, 'letter', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-center dark:text-white"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={maxGpa}
                          value={grade.points}
                          onChange={(e) => handleUpdateGrade(idx, 'points', e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-mono font-bold text-center dark:text-white text-emerald-600 dark:text-emerald-400"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={grade.label || ''}
                          onChange={(e) => handleUpdateGrade(idx, 'label', e.target.value)}
                          placeholder="e.g. Excellent / Pass"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 dark:text-white"
                        />
                      </td>
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleDeleteGrade(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition"
                          title="Delete Grade"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs sm:text-sm font-semibold transition"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 transition shadow-md shadow-emerald-600/20"
          >
            <Check className="w-4 h-4" />
            <span>Save & Apply Scale</span>
          </button>
        </div>

      </div>

    </div>
  );
}
