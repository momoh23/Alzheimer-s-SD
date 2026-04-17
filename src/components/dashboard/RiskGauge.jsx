import { cn } from "@/lib/utils";

export default function RiskGauge({ score, size = 160 }) {
  const percentage = score * 100;
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score * 0.75 * circumference);
  
  const getColor = (s) => {
    if (s < 0.3) return "text-accent";
    if (s < 0.6) return "text-chart-4";
    if (s < 0.8) return "text-chart-5";
    return "text-destructive";
  };

  const getLabel = (s) => {
    if (s < 0.3) return "Low Risk";
    if (s < 0.6) return "Moderate";
    if (s < 0.8) return "High Risk";
    return "Very High";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.75} viewBox="0 0 160 120" className="overflow-visible">
        {/* Background arc */}
        <path
          d="M 20 110 A 60 60 0 1 1 140 110"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <path
          d="M 20 110 A 60 60 0 1 1 140 110"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${score * 283} 283`}
          className={cn("transition-all duration-1000", getColor(score))}
        />
        {/* Center text */}
        <text x="80" y="75" textAnchor="middle" className="fill-foreground text-3xl font-bold" style={{ fontSize: '28px' }}>
          {percentage.toFixed(0)}%
        </text>
        <text x="80" y="98" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: '11px' }}>
          {getLabel(score)}
        </text>
      </svg>
    </div>
  );
}