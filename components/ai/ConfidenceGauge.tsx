"use client";

interface ConfidenceGaugeProps {
  score: number;
  size?: number;
}

export function ConfidenceGauge({ score, size = 160 }: ConfidenceGaugeProps) {
  const circumference = Math.PI * 70;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 70) return "#10b981";
    if (s >= 40) return "#f59e0b";
    return "#ef4444";
  };

  const getLabel = (s: number) => {
    if (s >= 70) return "Strong";
    if (s >= 50) return "Moderate";
    if (s >= 30) return "Weak";
    return "Very Weak";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox="0 0 180 110">
        <path
          d="M 10 100 A 80 80 0 0 1 170 100"
          fill="none"
          stroke="#1e293b"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 10 100 A 80 80 0 0 1 170 100"
          fill="none"
          stroke={getColor(score)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
        />
        <text
          x="90"
          y="85"
          textAnchor="middle"
          className="text-3xl font-bold font-mono"
          fill={getColor(score)}
        >
          {score}
        </text>
        <text
          x="90"
          y="105"
          textAnchor="middle"
          className="text-[10px] font-mono uppercase"
          fill="#475569"
        >
          {getLabel(score)}
        </text>
      </svg>
    </div>
  );
}
