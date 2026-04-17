import { tauData, featureImportance } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Dna, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ComposedChart, Line, Area } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-medium mb-2">{d.region || d.feature}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-medium">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const tauFeatures = featureImportance.filter(f => f.category === "tau");

const braakStages = [
  { stage: "I", description: "Entorhinal cortex", severity: 15 },
  { stage: "II", description: "Hippocampal formation", severity: 30 },
  { stage: "III", description: "Inferior temporal", severity: 55 },
  { stage: "IV", description: "Middle temporal, fusiform", severity: 70 },
  { stage: "V", description: "Superior temporal, parietal", severity: 85 },
  { stage: "VI", description: "Primary sensory/motor", severity: 95 },
];

const radarData = tauData.map(d => ({
  region: d.region.replace(" Cortex", ""),
  ptau181: d.ptau181,
  nftDensity: d.nftDensity * 50,
  fullMark: 50,
}));

export default function TauAnalysis() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Dna className="h-4 w-4 text-secondary" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Tau Pathology</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Tau Tangle Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Neural network interpretation of phosphorylated tau, NFT density, and Braak staging</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl border border-secondary/20 p-4 glow-secondary">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Peak p-Tau181</p>
          <p className="text-xl font-bold mt-1 font-mono">42.5 <span className="text-xs font-normal text-muted-foreground">pg/mL</span></p>
          <p className="text-[11px] text-secondary mt-1">Entorhinal cortex</p>
        </div>
        <div className="bg-card rounded-xl border border-secondary/20 p-4 glow-secondary">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Peak p-Tau217</p>
          <p className="text-xl font-bold mt-1 font-mono">8.9 <span className="text-xs font-normal text-muted-foreground">pg/mL</span></p>
          <p className="text-[11px] text-secondary mt-1">Entorhinal cortex</p>
        </div>
        <div className="bg-card rounded-xl border border-chart-4/20 p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Braak Stage</p>
          <p className="text-xl font-bold mt-1 font-mono">III–IV</p>
          <p className="text-[11px] text-chart-4 mt-1">Limbic predominant</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">DNN Feature Weight</p>
          <p className="text-xl font-bold mt-1 font-mono">0.162</p>
          <p className="text-[11px] text-muted-foreground mt-1">2nd highest importance</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tau Markers by Region */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-1">Phosphorylated Tau by Brain Region</h3>
          <p className="text-xs text-muted-foreground mb-4">p-Tau181, p-Tau217, and total tau concentrations</p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={tauData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="region" tick={{ fontSize: 8, angle: -20 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar yAxisId="left" dataKey="ptau181" name="p-Tau181" fill="hsl(250, 60%, 58%)" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="left" dataKey="ptau217" name="p-Tau217" fill="hsl(280, 65%, 60%)" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="totalTau" name="Total Tau" stroke="hsl(36, 95%, 58%)" strokeWidth={2} dot={{ fill: "hsl(36, 95%, 58%)" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* NFT Density Radar */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-1">NFT Density & p-Tau181 Distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">Neurofibrillary tangle density pattern across regions</p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="region" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} />
              <Radar name="p-Tau181" dataKey="ptau181" stroke="hsl(250, 60%, 58%)" fill="hsl(250, 60%, 58%)" fillOpacity={0.2} strokeWidth={2} />
              <Radar name="NFT Density (×50)" dataKey="nftDensity" stroke="hsl(0, 84%, 60%)" fill="hsl(0, 84%, 60%)" fillOpacity={0.1} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Braak Staging */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-1">Braak Staging Progression</h3>
        <p className="text-xs text-muted-foreground mb-5">Predicted tau spreading pattern according to Braak neuropathological staging</p>
        <div className="flex flex-wrap items-center gap-2">
          {braakStages.map((s, i) => {
            const isActive = i <= 3;
            return (
              <div key={i} className="flex items-center gap-2">
                <div className={cn(
                  "flex flex-col items-center p-3 rounded-lg border min-w-[100px] transition-all",
                  isActive ? "border-secondary/30 bg-secondary/5" : "border-border bg-muted/20 opacity-40"
                )}>
                  <span className={cn("text-lg font-bold font-mono", isActive && "text-secondary")}>{s.stage}</span>
                  <span className="text-[9px] text-muted-foreground text-center mt-1">{s.description}</span>
                  <div className="w-full h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", isActive ? "bg-secondary" : "bg-muted-foreground/20")}
                      style={{ width: `${isActive ? s.severity : 0}%` }}
                    />
                  </div>
                </div>
                {i < braakStages.length - 1 && (
                  <ArrowRight className={cn("h-4 w-4 shrink-0", isActive ? "text-secondary/50" : "text-muted-foreground/20")} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature Importance */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-1">DNN Feature Importance — Tau Biomarkers</h3>
        <p className="text-xs text-muted-foreground mb-4">SHAP-based interpretation of tau feature contributions to prediction</p>
        <div className="space-y-3">
          {tauFeatures.map((f, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-36 shrink-0">{f.feature}</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary rounded-full transition-all duration-700"
                  style={{ width: `${f.importance * 100 / 0.162 * 100}%`, maxWidth: '100%' }}
                />
              </div>
              <span className="text-xs font-mono font-bold w-12 text-right">{(f.importance * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border border-border p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4">Regional Tau Biomarker Data</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Region</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">p-Tau181 (pg/mL)</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">p-Tau217 (pg/mL)</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Total Tau</th>
              <th className="text-center py-3 px-2 font-medium text-muted-foreground">Braak Stage</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">NFT Density</th>
            </tr>
          </thead>
          <tbody>
            {tauData.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-2 font-medium">{row.region}</td>
                <td className="py-3 px-2 text-right font-mono">{row.ptau181.toFixed(1)}</td>
                <td className="py-3 px-2 text-right font-mono">{row.ptau217.toFixed(1)}</td>
                <td className="py-3 px-2 text-right font-mono">{row.totalTau}</td>
                <td className="py-3 px-2 text-center font-mono font-bold text-secondary">{row.braakStage}</td>
                <td className="py-3 px-2 text-right font-mono">{row.nftDensity.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}