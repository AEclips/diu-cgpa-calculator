import React from 'react';

export default function Footer({ onBackup, onRestore }) {
  return (
    <footer className="w-full no-print">
      <div
        className="max-w-3xl mx-auto px-4 sm:px-6 py-7 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        style={{
          borderColor: 'var(--border-hairline)',
          color: 'var(--text-tertiary)'
        }}
      >
        <span>UniGrade · Stored locally</span>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBackup}
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            Backup JSON
          </button>
          <button
            type="button"
            onClick={onRestore}
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            Restore
          </button>
        </div>
      </div>
    </footer>
  );
}
