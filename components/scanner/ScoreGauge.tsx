"use client";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "md";
}

export function ScoreGauge({ score, label, size = "md" }: ScoreGaugeProps) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "#10b981";
    if (s >= 60) return "#3b82f6";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const radius = size === "sm" ? 28 : 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg
        width={size === "sm" ? 68 : 88}
        height={size === "sm" ? 68 : 88}
        viewBox={`0 0 ${(radius + 6) * 2} ${(radius + 6) * 2}`}
      >
        <circle
          cx={radius + 6}
          cy={radius + 6}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="5"
        />
        <circle
          cx={radius + 6}
          cy={radius + 6}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${radius + 6} ${radius + 6})`}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
        <text
          x={radius + 6}
          y={radius + 6}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize={size === "sm" ? "12" : "16"}
          fontWeight="bold"
          fontFamily="monospace"
        >
          {score}
        </text>
      </svg>
      <span className="text-[10px] text-slate-500 mt-1 font-mono">{label}</span>
    </div>
  );
}
