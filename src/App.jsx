import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import Header from './components/Header';
import StatCards from './components/StatCards';
import SemesterList from './components/SemesterList';
import TargetGpaModal from './components/TargetGpaModal';
import ExportReportModal from './components/ExportReportModal';
import Footer from './components/Footer';

import { GRADING_SCALES, DEFAULT_SCALE_ID } from './constants/gradingScales';
import { SAMPLE_SEMESTERS, INITIAL_EMPTY_SEMESTERS } from './constants/sampleData';
import { calculateCumulativeStats } from './utils/calculator';
import { saveState, loadState, exportBackupFile, parseImportFile } from './utils/storage';

const ACCENT_PRESETS = {
  blue: {
    id: 'blue',
    label: 'Apple Blue',
    light: { accent: '#0071E3', hover: '#0077ED', soft: 'rgba(0, 113, 227, 0.10)' },
    dark: { accent: '#2997FF', hover: '#40A3FF', soft: 'rgba(41, 151, 255, 0.15)' }
  },
  indigo: {
    id: 'indigo',
    label: 'Indigo',
    light: { accent: '#5856D6', hover: '#4D4BC9', soft: 'rgba(88, 86, 214, 0.10)' },
    dark: { accent: '#7D7AFF', hover: '#918EFF', soft: 'rgba(125, 122, 255, 0.16)' }
  },
  emerald: {
    id: 'emerald',
    label: 'Mint Green',
    light: { accent: '#1D8348', hover: '#19703D', soft: 'rgba(29, 131, 72, 0.10)' },
    dark: { accent: '#30D158', hover: '#46D96B', soft: 'rgba(48, 209, 88, 0.15)' }
  },
  amber: {
    id: 'amber',
    label: 'Warm Amber',
    light: { accent: '#C96A00', hover: '#B35E00', soft: 'rgba(201, 106, 0, 0.10)' },
    dark: { accent: '#FF9F0A', hover: '#FFAD33', soft: 'rgba(255, 159, 10, 0.16)' }
  },
  graphite: {
    id: 'graphite',
    label: 'Graphite',
    light: { accent: '#3A3A3C', hover: '#2C2C2E', soft: 'rgba(58, 58, 60, 0.10)' },
    dark: { accent: '#AEAEB2', hover: '#C7C7CC', soft: 'rgba(174, 174, 178, 0.16)' }
  }
};

function formatOrdinal(n) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

export default function App() {
  const savedData = loadState();

  const [semesters, setSemesters] = useState(() => {
    return savedData.semesters && savedData.semesters.length > 0
      ? savedData.semesters
      : SAMPLE_SEMESTERS;
  });

  const [activeScaleId, setActiveScaleId] = useState(() => {
    const id = savedData.scaleId;
    return id && GRADING_SCALES[id] ? id : DEFAULT_SCALE_ID;
  });

  const [studentInfo, setStudentInfo] = useState(() => {
    return savedData.studentInfo?.name
      ? savedData.studentInfo
      : {
          name: 'Alex Johnson',
          id: '211-15-4321',
          university: 'Daffodil International University',
          major: 'B.Sc. in Computer Science & Engineering (CSE)',
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('unigrade_theme') === 'dark';
  });

  const [accentId, setAccentId] = useState(() => {
    const saved = localStorage.getItem('unigrade_accent');
    return saved && ACCENT_PRESETS[saved] ? saved : 'blue';
  });

  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const toastTimerRef = useRef(null);
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
    const preset = ACCENT_PRESETS[accentId] || ACCENT_PRESETS.blue;
    const palette = darkMode ? preset.dark : preset.light;
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty('--accent', palette.accent);
    rootStyle.setProperty('--accent-hover', palette.hover);
    rootStyle.setProperty('--accent-soft', palette.soft);
    localStorage.setItem('unigrade_accent', preset.id);
  }, [accentId, darkMode]);

  useEffect(() => {
    saveState(semesters, activeScaleId, {}, studentInfo);
  }, [semesters, activeScaleId, studentInfo]);

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2600);
  };

  const activeScale = GRADING_SCALES[activeScaleId] || GRADING_SCALES[DEFAULT_SCALE_ID];
  const stats = calculateCumulativeStats(semesters, activeScale);

  const handleAddSemester = () => {
    const nextNum = semesters.length + 1;
    const label = `${formatOrdinal(nextNum)} Semester`;
    const newSem = {
      id: 'sem-' + Date.now(),
      name: label,
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
        }
      ]
    };
    setSemesters([...semesters, newSem]);
    showToast(`Added ${label}`);
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
      courses: source.courses.map((c) => ({
        ...c,
        id: 'c-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7)
      }))
    };
    const updated = [...semesters];
    updated.splice(index + 1, 0, duplicated);
    setSemesters(updated);
    showToast(`Duplicated ${source.name}`);
  };

  const handleScaleChange = (scaleId) => {
    setActiveScaleId(scaleId);
    showToast(`Switched to ${GRADING_SCALES[scaleId]?.name || scaleId}`);
  };

  const handleLoadSampleData = () => {
    setSemesters(SAMPLE_SEMESTERS);
    setActiveScaleId('bd_ugc');
    showToast('Loaded sample semesters');
  };

  const handleResetData = () => {
    if (window.confirm('Reset all semesters and start fresh?')) {
      setSemesters(INITIAL_EMPTY_SEMESTERS);
      showToast('Reset to starter semester');
    }
  };

  const handleBackup = () => {
    exportBackupFile({
      semesters,
      activeScaleId,
      customScales: {},
      studentInfo
    });
    showToast('Backup JSON exported');
  };

  const handleRestoreFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await parseImportFile(file);
      if (data.semesters) setSemesters(data.semesters);
      if (data.activeScaleId && GRADING_SCALES[data.activeScaleId]) {
        setActiveScaleId(data.activeScaleId);
      }
      if (data.studentInfo) setStudentInfo(data.studentInfo);
      showToast('Backup restored');
    } catch (err) {
      alert('Failed to import backup file: ' + err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleRestoreFileSelected}
        className="hidden"
      />

      {toastMessage && (
        <div
          className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-lg animate-soft-enter no-print"
          style={{
            backgroundColor: 'var(--text-primary)',
            color: 'var(--bg-surface)'
          }}
        >
          <Check className="w-3.5 h-3.5" style={{ color: 'var(--positive)' }} strokeWidth={2.25} />
          <span>{toastMessage}</span>
        </div>
      )}

      <Header
        activeScaleId={activeScaleId}
        onScaleChange={handleScaleChange}
        onOpenTarget={() => setIsTargetModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        accentId={accentId}
        accentPresets={ACCENT_PRESETS}
        onAccentChange={(id) => {
          setAccentId(id);
          showToast(`Accent: ${ACCENT_PRESETS[id]?.label || id}`);
        }}
      />

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        <StatCards stats={stats} activeScale={activeScale} semesterCount={semesters.length} />

        <SemesterList
          semesters={semesters}
          activeScale={activeScale}
          onAddSemester={handleAddSemester}
          onUpdateSemester={handleUpdateSemester}
          onDeleteSemester={handleDeleteSemester}
          onDuplicateSemester={handleDuplicateSemester}
          onLoadSampleData={handleLoadSampleData}
          onResetData={handleResetData}
        />
      </main>

      <TargetGpaModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentCgpa={stats.cgpa}
        completedCredits={stats.totalCredits}
        activeScale={activeScale}
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

      <Footer
        onBackup={handleBackup}
        onRestore={() => fileInputRef.current?.click()}
      />
    </div>
  );
}
