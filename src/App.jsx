import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import StatCards from './components/StatCards';
import TrendChart from './components/TrendChart';
import SemesterList from './components/SemesterList';
import QuickPriorModal from './components/QuickPriorModal';
import TargetGpaModal from './components/TargetGpaModal';
import ScaleConfigModal from './components/ScaleConfigModal';
import ExportReportModal from './components/ExportReportModal';
import Footer from './components/Footer';

import { GRADING_SCALES, DEFAULT_SCALE_ID } from './constants/gradingScales';
import { SAMPLE_SEMESTERS, INITIAL_EMPTY_SEMESTERS } from './constants/sampleData';
import { calculateCumulativeStats } from './utils/calculator';
import { saveState, loadState, exportBackupFile, parseImportFile } from './utils/storage';

export default function App() {
  const savedData = loadState();

  const [semesters, setSemesters] = useState(() => {
    return savedData.semesters && savedData.semesters.length > 0 
      ? savedData.semesters 
      : SAMPLE_SEMESTERS;
  });

  const [activeScaleId, setActiveScaleId] = useState(() => {
    return savedData.scaleId || DEFAULT_SCALE_ID;
  });

  const [customScales, setCustomScales] = useState(() => {
    return savedData.customScales || {};
  });

  const [studentInfo, setStudentInfo] = useState(() => {
    return savedData.studentInfo?.name ? savedData.studentInfo : {
      name: 'Alex Johnson',
      id: '211-15-4321',
      university: 'Daffodil International University',
      major: 'B.Sc. in Computer Science & Engineering (CSE)',
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('unigrade_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Modal Visibility States
  const [isPriorModalOpen, setIsPriorModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isScaleModalOpen, setIsScaleModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('unigrade_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('unigrade_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    saveState(semesters, activeScaleId, customScales, studentInfo);
  }, [semesters, activeScaleId, customScales, studentInfo]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const allScales = { ...GRADING_SCALES, ...customScales };
  const activeScale = allScales[activeScaleId] || GRADING_SCALES[DEFAULT_SCALE_ID];

  const stats = calculateCumulativeStats(semesters, activeScale);

  const handleAddSemester = () => {
    const nextNum = semesters.length + 1;
    const newSem = {
      id: 'sem-' + Date.now(),
      name: `${nextNum}th Semester`,
      collapsed: false,
      courses: [
        {
          id: 'c-' + Date.now() + '-1',
          code: `CSE ${nextNum * 100 + 10}`,
          title: 'Theory Course',
          credits: 3.0,
          grade: activeScale.grades[0]?.letter || 'A+',
          isRetake: false
        },
        {
          id: 'c-' + Date.now() + '-2',
          code: `CSE ${nextNum * 100 + 11}`,
          title: 'Lab Course',
          credits: 1.5,
          grade: activeScale.grades[0]?.letter || 'A+',
          isRetake: false
        },
        {
          id: 'c-' + Date.now() + '-3',
          code: `MAT ${nextNum * 100 + 20}`,
          title: 'Mathematics Course',
          credits: 3.0,
          grade: activeScale.grades[1]?.letter || 'A',
          isRetake: false
        }
      ]
    };
    setSemesters([...semesters, newSem]);
    showToast(`Added ${nextNum}th Semester ✨`);
  };

  const handleUpdateSemester = (index, updated) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[index] = updated;
    setSemesters(updatedSemesters);
  };

  const handleDeleteSemester = (index) => {
    if (semesters.length === 1) {
      if (window.confirm('Clear all courses in this semester?')) {
        setSemesters([{ ...semesters[0], courses: [] }]);
        showToast('Cleared semester courses');
      }
      return;
    }
    const name = semesters[index].name;
    setSemesters(semesters.filter((_, idx) => idx !== index));
    showToast(`Removed ${name}`);
  };

  const handleDuplicateSemester = (index) => {
    const source = semesters[index];
    const duplicated = {
      ...source,
      id: 'sem-' + Date.now(),
      name: `${source.name} (Copy)`,
      collapsed: false,
      courses: source.courses.map(c => ({
        ...c,
        id: 'c-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5)
      }))
    };
    const updated = [...semesters];
    updated.splice(index + 1, 0, duplicated);
    setSemesters(updated);
    showToast(`Duplicated ${source.name}`);
  };

  const handleExpandAll = () => {
    setSemesters(semesters.map(s => ({ ...s, collapsed: false })));
  };

  const handleCollapseAll = () => {
    setSemesters(semesters.map(s => ({ ...s, collapsed: true })));
  };

  const handleScaleChange = (scaleId) => {
    setActiveScaleId(scaleId);
    showToast(`Switched scale to ${allScales[scaleId]?.name || scaleId}`);
  };

  const handleSaveCustomScale = (newScale) => {
    setCustomScales(prev => ({
      ...prev,
      [newScale.id]: newScale
    }));
    setActiveScaleId(newScale.id);
    showToast(`Saved and applied "${newScale.name}"`);
  };

  const handleLoadSampleData = () => {
    setSemesters(SAMPLE_SEMESTERS);
    setActiveScaleId('bd_ugc');
    showToast('Loaded DIU CSE sample semesters! 🎓');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all semesters and start fresh?')) {
      setSemesters(INITIAL_EMPTY_SEMESTERS);
      showToast('Reset calculator to blank state');
    }
  };

  const handleBackup = () => {
    exportBackupFile({
      semesters,
      activeScaleId,
      customScales,
      studentInfo
    });
    showToast('Backup JSON exported!');
  };

  const handleRestoreFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseImportFile(file);
      if (data.semesters) setSemesters(data.semesters);
      if (data.activeScaleId) setActiveScaleId(data.activeScaleId);
      if (data.customScales) setCustomScales(data.customScales);
      if (data.studentInfo) setStudentInfo(data.studentInfo);
      showToast('Successfully restored backup records! ✨');
    } catch (err) {
      alert('Failed to import backup file: ' + err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 relative selection:bg-emerald-500 selection:text-white">
      
      {/* Ambient Floating Glassmorphic Blobs */}
      <div className="background-decorations" aria-hidden="true">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Hidden File Input for Restore */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleRestoreFileSelected}
        className="hidden"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-xl text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-2.5 border border-white/10">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        activeScaleId={activeScaleId}
        onScaleChange={handleScaleChange}
        customScales={customScales}
        onOpenScaleModal={() => setIsScaleModalOpen(true)}
        onOpenTargetModal={() => setIsTargetModalOpen(true)}
        onOpenPriorModal={() => setIsPriorModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onLoadSampleData={handleLoadSampleData}
        onResetData={handleResetData}
        onBackup={handleBackup}
        onRestoreClick={() => fileInputRef.current?.click()}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 relative z-10">
        
        {/* Cumulative Metric Stat Cards */}
        <section aria-label="CGPA Summary Metrics">
          <StatCards stats={stats} activeScale={activeScale} />
        </section>

        {/* GPA Trend & Grade Distribution */}
        <section aria-label="GPA Trend and Distribution">
          <TrendChart 
            semesterStats={stats.semesterStats} 
            activeScale={activeScale} 
            gradeDistribution={stats.gradeDistribution} 
          />
        </section>

        {/* Semesters & Courses Breakdown */}
        <section aria-label="Semesters and Course List">
          <SemesterList
            semesters={semesters}
            activeScale={activeScale}
            onAddSemester={handleAddSemester}
            onUpdateSemester={handleUpdateSemester}
            onDeleteSemester={handleDeleteSemester}
            onDuplicateSemester={handleDuplicateSemester}
            onExpandAll={handleExpandAll}
            onCollapseAll={handleCollapseAll}
          />
        </section>

      </main>

      {/* Modals */}
      <QuickPriorModal
        isOpen={isPriorModalOpen}
        onClose={() => setIsPriorModalOpen(false)}
        totalCredits={stats.totalCredits}
        currentCgpa={stats.cgpa}
      />

      <TargetGpaModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentCgpa={stats.cgpa}
        completedCredits={stats.totalCredits}
        activeScale={activeScale}
      />

      <ScaleConfigModal
        isOpen={isScaleModalOpen}
        onClose={() => setIsScaleModalOpen(false)}
        activeScale={activeScale}
        onSaveCustomScale={handleSaveCustomScale}
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        semesters={semesters}
        stats={stats}
        activeScale={activeScale}
        studentInfo={studentInfo}
        onUpdateStudentInfo={setStudentInfo}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
