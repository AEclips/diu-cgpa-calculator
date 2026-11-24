import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Target, FileDown, Sun, Moon, ChevronDown, Check } from 'lucide-react';
import { GRADING_SCALES } from '../constants/gradingScales';

const SCALE_LABELS = {
  bd_ugc: { short: 'DIU 4.0', full: 'DIU / UGC (4.0)' },
  '4.0': { short: 'US 4.0', full: 'US Standard (4.0)' },
  '4.3': { short: '4.3 Scale', full: 'Honors (4.3)' },
  '5.0': { short: '5.0 Scale', full: '5.0 Scale' },
  '10.0': { short: '10.0', full: 'Indian UGC (10.0)' }
};

export default function Header({
  activeScaleId,
  onScaleChange,
  onOpenTarget,
  onOpenExport,
  darkMode,
  onToggleDarkMode,
  accentId,
  accentPresets,
  onAccentChange
}) {
  const [scaleMenuOpen, setScaleMenuOpen] = useState(false);
  const [accentMenuOpen, setAccentMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const accentRef = useRef(null);

  useEffect(() => {
    if (!scaleMenuOpen && !accentMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setScaleMenuOpen(false);
      }
      if (accentRef.current && !accentRef.current.contains(e.target)) {
        setAccentMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setScaleMenuOpen(false);
        setAccentMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [scaleMenuOpen, accentMenuOpen]);

  const currentLabel = SCALE_LABELS[activeScaleId] || { short: activeScaleId, full: activeScaleId };

  return (
    <header
      className="sticky top-0 z-30 border-b backdrop-blur-xl no-print"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg-canvas) 82%, transparent)',
        borderColor: 'var(--border-hairline)'
      }}
    >
      <div className="max-w-3xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Brand + Scale Selector */}
        <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.75} />
            </div>
            <span
              className="font-semibold text-[13px] sm:text-[15px] tracking-[-0.015em] whitespace-nowrap"
              style={{ color: 'var(--text-primary)' }}
            >
              UniGrade
            </span>
          </div>

          <div className="relative min-w-0 shrink" ref={menuRef}>
            <button
              type="button"
              onClick={() => {
                setAccentMenuOpen(false);
                setScaleMenuOpen((prev) => !prev);
              }}
              aria-haspopup="listbox"
              aria-expanded={scaleMenuOpen}
              aria-label="Grading scale"
              className="tactile-press inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full border text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors hover:bg-[var(--bg-hover)]"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-hairline)',
                color: 'var(--text-secondary)'
              }}
            >
              <span className="sm:hidden">{currentLabel.short}</span>
              <span className="hidden sm:inline">{currentLabel.full}</span>
              <ChevronDown
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 transition-transform duration-150 ${
                  scaleMenuOpen ? 'rotate-180' : ''
                }`}
                style={{ color: 'var(--text-tertiary)' }}
                strokeWidth={1.75}
              />
            </button>

            {scaleMenuOpen && (
              <div
                role="listbox"
                aria-label="Select grading scale"
                className="absolute left-0 mt-1.5 w-52 p-1.5 rounded-2xl border z-50 animate-soft-enter"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                  boxShadow: 'var(--shadow-modal)'
                }}
              >
                {Object.values(GRADING_SCALES).map((scale) => {
                  const isSelected = scale.id === activeScaleId;
                  const label = SCALE_LABELS[scale.id]?.full || scale.name;
                  return (
                    <button
                      key={scale.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onScaleChange(scale.id);
                        setScaleMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-medium flex items-center justify-between gap-2 transition-colors hover:bg-[var(--bg-subtle)]"
                      style={{
                        color: isSelected ? 'var(--accent)' : 'var(--text-primary)'
                      }}
                    >
                      <span>{label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" strokeWidth={2} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quiet Action Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenTarget}
            className="tactile-press inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-primary)' }}
          >
            <Target className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
            <span>Target</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="tactile-press inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-primary)' }}
          >
            <FileDown className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-secondary)' }} strokeWidth={1.75} />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Accent Color Picker */}
          <div className="relative" ref={accentRef}>
            <button
              type="button"
              onClick={() => {
                setScaleMenuOpen(false);
                setAccentMenuOpen((prev) => !prev);
              }}
              aria-haspopup="listbox"
              aria-expanded={accentMenuOpen}
              aria-label="Accent color"
              title="Accent color"
              className="tactile-press w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-[var(--bg-hover)]"
            >
              <span
                className="w-3 h-3 rounded-full ring-2 ring-black/10 dark:ring-white/15"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            </button>

            {accentMenuOpen && accentPresets && (
              <div
                role="listbox"
                aria-label="Select accent color"
                className="absolute right-0 mt-1.5 flex items-center gap-2 p-2 rounded-full border z-50 animate-soft-enter"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                  boxShadow: 'var(--shadow-modal)'
                }}
              >
                {Object.values(accentPresets).map((preset) => {
                  const isSelected = preset.id === accentId;
                  const swatchColor = darkMode ? preset.dark.accent : preset.light.accent;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      aria-label={preset.label}
                      title={preset.label}
                      onClick={() => {
                        onAccentChange(preset.id);
                        setAccentMenuOpen(false);
                      }}
                      className="tactile-press w-5 h-5 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                      style={{
                        backgroundColor: swatchColor,
                        boxShadow: isSelected
                          ? `0 0 0 2px var(--bg-surface), 0 0 0 3.5px ${swatchColor}`
                          : 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
            className="tactile-press w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            {darkMode ? (
              <Sun className="w-4 h-4" strokeWidth={1.75} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
