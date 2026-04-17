import { cn } from "@/lib/utils";

const BASE_COLORS = [
  "hsl(168, 76%, 42%)",
  "hsl(199, 89%, 48%)",
  "hsl(36, 95%, 58%)",
  "hsl(0, 84%, 60%)",
];

const STAGES = ["Normal", "Preclinical AD", "MCI due to AD", "AD Dementia"];

// Derive stage probabilities from patient risk score
function getDistribution(patient) {
  const r = patient?.riskScore ?? 0.78;
  // Low risk → concentrated in Normal/Preclinical; high risk → MCI/Dementia
  if (r < 0.2) return [0.72, 0.18, 0.07, 0.03];
  if (r < 0.4) return [0.18, 0.48, 0.28, 0.06];
  if (r < 0.65) return [0.05, 0.18, 0.62, 0.15];
  if (r < 0.85) return [0.04, 0.10, 0.68, 0.18];
  return [0.01, 0.04, 0.18, 0.77];
}

export default function StageDistribution({ patient }) {
  const probs = getDistribution(patient);
  const maxProb = Math.max(...probs);
  const maxIdx = probs.indexOf(maxProb);

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold mb-1">Classification Output</h3>
      <p className="text-xs text-muted-foreground mb-5">Softmax probability distribution across AD stages</p>

      <div className="space-y-4">
        {STAGES.map((name, i) => {
          const isMax = i === maxIdx;
          const prob = probs[i];
          return (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn("text-xs font-medium", isMax ? "text-foreground" : "text-muted-foreground")}>{name}</span>
                <span className={cn("text-sm font-mono font-bold", isMax ? "text-foreground" : "text-muted-foreground")}>
                  {(prob * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${prob * 100}%`,
                    backgroundColor: BASE_COLORS[i],
                    boxShadow: isMax ? `0 0 12px ${BASE_COLORS[i]}40` : 'none',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: BASE_COLORS[maxIdx] }} />
          <span className="text-xs text-muted-foreground">
            Predicted: <span className="font-medium text-foreground">{STAGES[maxIdx]}</span>{" "}
            ({(maxProb * 100).toFixed(1)}% confidence)
          </span>
        </div>
      </div>
    </div>
  );
}