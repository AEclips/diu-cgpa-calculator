import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { calculateTargetGpa } from '../utils/calculator';

export default function TargetGpaModal({
  isOpen,
  onClose,
  currentCgpa,
  completedCredits,
  activeScale
}) {
  const maxScale = activeScale?.maxGpa || 4.0;

  const [targetCgpa, setTargetCgpa] = useState(() => {
    const val = (parseFloat(currentCgpa) || 3.0) + 0.2;
    return Math.min(maxScale, Number(val.toFixed(2)));
  });

  const [remainingCredits, setRemainingCredits] = useState(30);

  useEffect(() => {
    if (isOpen) {
      const cur = parseFloat(currentCgpa) || 3.0;
      const nextTarget = Math.min(maxScale, Number((cur + 0.2).toFixed(2)));
      setTargetCgpa(nextTarget);
    }
  }, [isOpen, currentCgpa, maxScale]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const result = calculateTargetGpa({
    currentCgpa,
    completedCredits,
    targetCgpa,
    remainingCredits,
    maxScale
  });

  const isImpossible = result.feasibility === 'impossible';
  const isHard = result.feasibility === 'hard';
  const statusColor = isImpossible
    ? 'var(--danger)'
    : isHard
    ? 'var(--warning)'
    : 'var(--positive)';
  const statusBg = isImpossible
    ? 'var(--danger-soft)'
    : isHard
    ? 'var(--warning-soft)'
    : 'var(--positive-soft)';

  const reqProgress = result.isValid
    ? Math.min(100, Math.max(0, ((result.requiredGpa || 0) / maxScale) * 100))
    : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/35 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="target-modal-title"
    >
      <div
        className="modal-sheet w-full max-w-md overflow-hidden animate-soft-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between border-b"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <h3
            id="target-modal-title"
            className="text-base font-semibold tracking-[-0.015em]"
            style={{ color: 'var(--text-primary)' }}
          >
            Target CGPA Planner
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Current Standing Strip */}
          <div
            className="grid grid-cols-2 gap-4 p-4 rounded-2xl"
            style={{ backgroundColor: 'var(--bg-subtle)' }}
          >
            <div>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Current CGPA
              </span>
              <div
                className="text-xl font-bold tabular-nums mt-0.5"
                style={{ color: 'var(--text-primary)' }}
              >
                {(parseFloat(currentCgpa) || 0).toFixed(2)}
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>
                  / {maxScale.toFixed(1)}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                Completed Credits
              </span>
              <div
                className="text-xl font-bold tabular-nums mt-0.5"
                style={{ color: 'var(--text-primary)' }}
              >
                {completedCredits || 0}
                <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-tertiary)' }}>
                  cr
                </span>
              </div>
            </div>
          </div>

          {/* Numeric Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="target-cgpa-input"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Target CGPA
              </label>
              <input
                id="target-cgpa-input"
                type="number"
                min="0.5"
                max={maxScale}
                step="0.05"
                value={targetCgpa}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setTargetCgpa(isNaN(v) ? 0 : Math.min(maxScale, Math.max(0, v)));
                }}
                className="w-full px-3 py-2 rounded-xl border text-sm font-semibold tabular-nums focus:outline-none focus:border-[var(--accent)]"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div>
              <label
                htmlFor="remaining-credits-input"
                className="block text-xs font-medium mb-1.5"
                style={{ color: 'var(--text-secondary)' }}
              >
                Remaining Credits
              </label>
              <input
                id="remaining-credits-input"
                type="number"
                min="1"
                max="200"
                step="0.5"
                value={remainingCredits}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setRemainingCredits(isNaN(v) ? 0 : Math.max(0, v));
                }}
                className="w-full px-3 py-2 rounded-xl border text-sm font-semibold tabular-nums focus:outline-none focus:border-[var(--accent)]"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-hairline)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>
          </div>

          {/* Verdict Card */}
          {result.isValid ? (
            <div className="p-4 rounded-2xl" style={{ backgroundColor: statusBg }}>
              <div className="flex items-start gap-3">
                {isImpossible ? (
                  <AlertCircle
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: statusColor }}
                    strokeWidth={1.75}
                  />
                ) : (
                  <CheckCircle2
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: statusColor }}
                    strokeWidth={1.75}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Required Avg GPA
                    </span>
                    <span
                      className="text-2xl font-bold tabular-nums tracking-tight"
                      style={{ color: statusColor }}
                    >
                      {result.requiredGpa > 0 ? result.requiredGpa.toFixed(2) : '0.00'}
                      <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>
                        / {maxScale.toFixed(1)}
                      </span>
                    </span>
                  </div>

                  <div
                    className="mt-2.5 h-1.5 w-full rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(128,128,128,0.16)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${reqProgress}%`, backgroundColor: statusColor }}
                    />
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {result.message}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="p-4 rounded-2xl text-xs"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
            >
              {result.message}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-3.5 flex justify-end border-t"
          style={{ borderColor: 'var(--border-hairline)', backgroundColor: 'var(--bg-subtle)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
