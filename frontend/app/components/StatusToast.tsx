// app/components/ProgressBar.tsx
"use client";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-300 relative"
        style={{ width: `${clampedProgress}%` }}
      >
        {clampedProgress < 100 && (
          <div className="absolute inset-0 animate-shimmer" />
        )}
      </div>
    </div>
  );
}