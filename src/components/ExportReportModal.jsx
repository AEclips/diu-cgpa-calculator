import React, { useState } from 'react';
import { 
  X, 
  FileDown, 
  Printer, 
  GraduationCap, 
  User, 
  Building, 
  Award, 
  Calendar,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { generatePdfFromElement } from '../utils/pdfExport';
import { getGradePoints } from '../utils/calculator';

export default function ExportReportModal({
  isOpen,
  onClose,
  semesters,
  stats,
  activeScale,
  studentInfo,
  onUpdateStudentInfo
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [info, setInfo] = useState(studentInfo || {
    name: 'Alex Johnson',
    id: '211-15-4321',
    university: 'Daffodil International University',
    major: 'B.Sc. in Computer Science & Engineering',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  });

  if (!isOpen) return null;

  const handleInfoChange = (field, val) => {
    const updated = { ...info, [field]: val };
    setInfo(updated);
    if (onUpdateStudentInfo) {
      onUpdateStudentInfo(updated);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsGenerating(true);
      await generatePdfFromElement('transcript-report-card', `UniGrade_Transcript_${info.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('Failed to generate PDF. You can also use the Print button to Save as PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header Controls */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <FileDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">Academic Grade Summary & PDF Transcript</h3>
              <p className="text-xs text-slate-400">Generate an official printable report card</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
              title="Print directly or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 dark:bg-slate-950/50">
          
          {/* Metadata Customization form */}
          <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm no-print">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Transcript Header Information
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Student Name</label>
                <input
                  type="text"
                  value={info.name}
                  onChange={(e) => handleInfoChange('name', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Student ID / Roll No.</label>
                <input
                  type="text"
                  value={info.id}
                  onChange={(e) => handleInfoChange('id', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">University / Institute</label>
                <input
                  type="text"
                  value={info.university}
                  onChange={(e) => handleInfoChange('university', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">Degree / Program</label>
                <input
                  type="text"
                  value={info.major}
                  onChange={(e) => handleInfoChange('major', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-medium dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Actual Printable / PDF Target Card */}
          <div 
            id="transcript-report-card" 
            className="bg-white text-slate-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-200 print-page max-w-3xl mx-auto"
          >
            {/* Institution & Document Header */}
            <div className="border-b-2 border-slate-900 pb-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                    {info.university || 'Daffodil International University'}
                  </h1>
                  <p className="text-sm font-semibold text-emerald-700 mt-0.5">
                    Official Grade Summary & Cumulative Performance Report
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Grading Scale: {activeScale.name} (Max: {activeScale.maxGpa.toFixed(2)})
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span>UNIGRADE REPORT</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 font-mono">
                    Date: {info.date}
                  </div>
                </div>
              </div>

              {/* Student Metadata Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                  <span className="font-bold text-slate-900">{info.name || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student ID</span>
                  <span className="font-mono font-bold text-slate-900">{info.id || '—'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Program / Major</span>
                  <span className="font-bold text-slate-900">{info.major || '—'}</span>
                </div>
              </div>
            </div>

            {/* Overall Score Banner */}
            <div className="grid grid-cols-4 gap-3 p-4 mb-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl text-center">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Overall CGPA</span>
                <span className="text-2xl font-black font-mono text-emerald-400">{stats.cgpaDisplay}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Total Credits</span>
                <span className="text-2xl font-black font-mono">{stats.totalCredits}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Quality Points</span>
                <span className="text-2xl font-black font-mono">{stats.totalQualityPoints}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Academic Standing</span>
                <span className="text-xs font-bold text-amber-300 block mt-1">
                  {stats.academicStanding?.label || 'Good Standing'}
                </span>
              </div>
            </div>

            {/* Semesters & Courses Breakdown */}
            <div className="space-y-6">
              {semesters.map((sem, sIdx) => {
                const semStat = stats.semesterStats[sIdx] || {};

                return (
                  <div key={sem.id || sIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 font-bold text-xs">
                      <span className="text-slate-900">{sem.name}</span>
                      <div className="flex space-x-3 text-slate-600">
                        <span>Credits: {semStat.credits || 0}</span>
                        <span className="text-emerald-700 font-extrabold">SGPA: {semStat.sgpaDisplay || '0.00'}</span>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] uppercase text-slate-400 font-semibold bg-slate-50">
                          <th className="py-1.5 px-3">Code</th>
                          <th className="py-1.5 px-3">Course Title</th>
                          <th className="py-1.5 px-3 text-center w-16">Credits</th>
                          <th className="py-1.5 px-3 text-center w-16">Grade</th>
                          <th className="py-1.5 px-3 text-right w-20">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sem.courses?.map((c, cIdx) => {
                          const pts = getGradePoints(c.grade, activeScale);
                          const cr = parseFloat(c.credits) || 0;
                          return (
                            <tr key={c.id || cIdx}>
                              <td className="py-1.5 px-3 font-mono font-medium text-slate-800">{c.code || '-'}</td>
                              <td className="py-1.5 px-3 text-slate-700">{c.title || '-'}</td>
                              <td className="py-1.5 px-3 text-center font-bold text-slate-800">{c.credits}</td>
                              <td className="py-1.5 px-3 text-center font-bold text-emerald-700">{c.grade}</td>
                              <td className="py-1.5 px-3 text-right font-mono text-slate-600">{(cr * pts).toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            {/* Footer Signoff */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400">
              <span>Generated via UniGrade BD CGPA Calculator System</span>
              <span>Valid Academic Standing Summary</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
