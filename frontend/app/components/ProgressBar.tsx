"use client";

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  progress,
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, progress));

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 relative"
          style={{ width: `${clamped}%` }}
        >
          {/* Shimmer */}
          <div className="absolute inset-0 animate-shimmer rounded-full" />
        </div>
      </div>
      {showLabel && (
        <span className="text-[11px] font-mono text-slate-500 tabular-nums w-8 text-right">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}