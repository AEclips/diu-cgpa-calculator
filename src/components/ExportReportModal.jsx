import React, { useState, useEffect } from 'react';
import { X, FileDown, Printer, Loader2 } from 'lucide-react';
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
  const [info, setInfo] = useState(
    studentInfo || {
      name: '',
      id: '',
      university: '',
      major: '',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

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
      const safeName = (info.name || 'Student').replace(/\s+/g, '_');
      await generatePdfFromElement('transcript-report-card', `UniGrade_Transcript_${safeName}.pdf`);
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('Failed to generate PDF. You can use Print to save as PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const standingLabel = stats.academicStanding?.label?.split(' / ')[0] || 'Good Standing';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        className="modal-sheet w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-soft-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b shrink-0 no-print"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <h3
            id="export-modal-title"
            className="text-base font-semibold tracking-[-0.015em]"
            style={{ color: 'var(--text-primary)' }}
          >
            Export Transcript
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:bg-[var(--bg-hover)]"
              style={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-subtle)' }}
            >
              <Printer className="w-3.5 h-3.5" strokeWidth={1.75} />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={1.75} />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" strokeWidth={1.75} />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)] ml-1"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div
          className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5"
          style={{ backgroundColor: 'var(--bg-subtle)' }}
        >
          {/* Compact Inline Student Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 no-print">
            <div>
              <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Student Name
              </label>
              <input
                type="text"
                value={info.name}
                onChange={(e) => handleInfoChange('name', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-[var(--accent)]"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Student ID
              </label>
              <input
                type="text"
                value={info.id}
                onChange={(e) => handleInfoChange('id', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border text-xs font-mono-code focus:outline-none focus:border-[var(--accent)]"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>
                University
              </label>
              <input
                type="text"
                value={info.university}
                onChange={(e) => handleInfoChange('university', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-[var(--accent)]"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium mb-1" style={{ color: 'var(--text-tertiary)' }}>
                Program
              </label>
              <input
                type="text"
                value={info.major}
                onChange={(e) => handleInfoChange('major', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border text-xs font-medium focus:outline-none focus:border-[var(--accent)]"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Minimal White A4 Transcript Preview */}
          <div
            id="transcript-report-card"
            className="bg-white text-[#1D1D1F] p-7 sm:p-9 rounded-2xl border border-black/10 shadow-sm max-w-3xl mx-auto"
          >
            {/* Document Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-black/10">
              <div>
                <h1 className="text-lg font-bold tracking-tight text-[#1D1D1F]">
                  {info.university || 'University'}
                </h1>
                <p className="text-xs text-[#6E6E73] mt-0.5">
                  Academic Grade Summary · {activeScale.name}
                </p>
              </div>
              <div className="sm:text-right text-xs text-[#6E6E73] tabular-nums">
                <div className="font-semibold text-[#1D1D1F]">Unofficial Transcript</div>
                <div className="mt-0.5">{info.date}</div>
              </div>
            </div>

            {/* Student & Cumulative Summary Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-black/10 text-xs">
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#86868B] font-medium">
                  Student
                </span>
                <span className="font-semibold text-[#1D1D1F]">{info.name || '—'}</span>
                <span className="block text-[11px] font-mono text-[#6E6E73]">{info.id || '—'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#86868B] font-medium">
                  Program
                </span>
                <span className="font-medium text-[#1D1D1F]">{info.major || '—'}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-wider text-[#86868B] font-medium">
                  Credits / Points
                </span>
                <span className="font-semibold text-[#1D1D1F] tabular-nums">
                  {stats.totalCredits} cr · {(stats.totalQualityPoints ?? 0).toFixed(2)} pts
                </span>
                <span className="block text-[11px] text-[#6E6E73]">{standingLabel}</span>
              </div>
              <div className="sm:text-right">
                <span className="block text-[10px] uppercase tracking-wider text-[#86868B] font-medium">
                  Cumulative GPA
                </span>
                <span className="text-2xl font-bold text-[#0071E3] tabular-nums tracking-tight">
                  {stats.cgpaDisplay}
                </span>
                <span className="text-xs text-[#86868B] ml-1 tabular-nums">
                  / {activeScale.maxGpa.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Semesters Breakdown */}
            <div className="mt-5 space-y-5">
              {semesters.map((sem, sIdx) => {
                const semStat = stats.semesterStats[sIdx] || {};
                return (
                  <div key={sem.id || sIdx} className="border border-black/10 rounded-xl overflow-hidden">
                    <div className="bg-[#F5F5F7] px-4 py-2 flex items-center justify-between border-b border-black/10 text-xs">
                      <span className="font-semibold text-[#1D1D1F]">{sem.name}</span>
                      <div className="flex items-center gap-3 tabular-nums">
                        <span className="text-[#6E6E73]">{semStat.credits || 0} cr</span>
                        <span className="font-semibold text-[#0071E3]">
                          SGPA {semStat.sgpaDisplay || '0.00'}
                        </span>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-black/5 text-[10px] uppercase tracking-wider text-[#86868B]">
                          <th className="py-1.5 px-3 font-medium w-24">Code</th>
                          <th className="py-1.5 px-3 font-medium">Course</th>
                          <th className="py-1.5 px-3 text-right font-medium w-16">Cr</th>
                          <th className="py-1.5 px-3 text-right font-medium w-16">Grade</th>
                          <th className="py-1.5 px-3 text-right font-medium w-16">Pts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/5">
                        {sem.courses?.map((c, cIdx) => {
                          const pts = getGradePoints(c.grade, activeScale);
                          const cr = parseFloat(c.credits) || 0;
                          return (
                            <tr key={c.id || cIdx}>
                              <td className="py-1.5 px-3 font-mono text-[11px] text-[#6E6E73]">
                                {c.code || '—'}
                              </td>
                              <td className="py-1.5 px-3 text-[#1D1D1F]">{c.title || '—'}</td>
                              <td className="py-1.5 px-3 text-right tabular-nums text-[#1D1D1F]">
                                {cr.toFixed(1)}
                              </td>
                              <td className="py-1.5 px-3 text-right font-semibold tabular-nums text-[#1D1D1F]">
                                {c.grade}
                              </td>
                              <td className="py-1.5 px-3 text-right tabular-nums text-[#6E6E73]">
                                {(cr * pts).toFixed(2)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-3 border-t border-black/10 flex justify-between items-center text-[10px] text-[#86868B]">
              <span>Generated with UniGrade</span>
              <span>Scale max {activeScale.maxGpa.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
