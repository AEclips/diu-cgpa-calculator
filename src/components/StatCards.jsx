import React from 'react';
import useAnimatedNumber from '../hooks/useAnimatedNumber';

const STANDING_DOT_COLOR = {
  emerald: 'var(--positive)',
  green: 'var(--positive)',
  blue: 'var(--accent)',
  amber: 'var(--warning)',
  rose: 'var(--danger)'
};

function cleanStandingLabel(standing) {
  if (!standing) return null;
  if (standing.label) {
    return standing.label.split(' / ')[0];
  }
  return standing.badge?.replace(/^[^\w]+/, '').trim() || null;
}

export default function StatCards({ stats, activeScale, semesterCount }) {
  const maxGpa = activeScale?.maxGpa || 4.0;
  const cgpaValue = stats?.cgpa || 0;
  const animatedCgpa = useAnimatedNumber(cgpaValue, 340);
  const animatedCredits = useAnimatedNumber(stats?.totalCredits ?? 0, 320);
  const animatedQualityPoints = useAnimatedNumber(stats?.totalQualityPoints ?? 0, 340);

  const cgpaDisplay = (stats?.totalCredits ?? 0) > 0 ? animatedCgpa.toFixed(2) : '0.00';
  const creditsDisplay = Number(animatedCredits.toFixed(1));
  const qpDisplay = animatedQualityPoints.toFixed(2);
  const progressPercent = Math.min(100, Math.max(0, (cgpaValue / maxGpa) * 100));
  const standingText = cleanStandingLabel(stats?.academicStanding);
  const dotColor = STANDING_DOT_COLOR[stats?.academicStanding?.color] || 'var(--accent)';

  return (
    <section className="surface-card overflow-hidden animate-soft-enter" aria-label="Cumulative GPA summary">
      <div className="px-6 py-6 sm:px-8 sm:py-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        {/* Left: Hero CGPA & Standing */}
        <div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-5xl sm:text-6xl font-bold tracking-[-0.035em] leading-none tabular-nums"
              style={{ color: 'var(--text-primary)' }}
            >
              {cgpaDisplay}
            </span>
            <span
              className="text-base sm:text-lg font-medium tabular-nums"
              style={{ color: 'var(--text-tertiary)' }}
            >
              / {maxGpa.toFixed(2)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className="text-xs font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cumulative GPA
            </span>

            {standingText && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-primary)'
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: dotColor }}
                />
                <span>{standingText}</span>
              </span>
            )}

            {stats?.percentage != null && (stats?.totalCredits ?? 0) > 0 && (
              <span
                className="text-xs font-medium tabular-nums"
                style={{ color: 'var(--text-tertiary)' }}
              >
                {stats.percentage}%
              </span>
            )}
          </div>
        </div>

        {/* Right: Scannable Inline Metrics */}
        <div
          className="grid grid-cols-3 sm:flex sm:items-center gap-4 sm:gap-6 pt-4 sm:pt-0 border-t sm:border-t-0"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <div>
            <div className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Credits
            </div>
            <div
              className="mt-0.5 text-lg sm:text-xl font-semibold tabular-nums tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {creditsDisplay}
            </div>
          </div>

          <div
            className="hidden sm:block w-px h-8"
            style={{ backgroundColor: 'var(--border-hairline)' }}
          />

          <div>
            <div className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Quality Points
            </div>
            <div
              className="mt-0.5 text-lg sm:text-xl font-semibold tabular-nums tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {qpDisplay}
            </div>
          </div>

          <div
            className="hidden sm:block w-px h-8"
            style={{ backgroundColor: 'var(--border-hairline)' }}
          />

          <div>
            <div className="text-[11px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Semesters
            </div>
            <div
              className="mt-0.5 text-lg sm:text-xl font-semibold tabular-nums tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {semesterCount}
            </div>
          </div>
        </div>
      </div>

      {/* Razor-thin Progress Track */}
      <div className="h-[3px] w-full" style={{ backgroundColor: 'var(--bg-subtle)' }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: 'var(--accent)'
          }}
        />
      </div>
    </section>
  );
}
