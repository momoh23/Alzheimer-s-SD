import { amyloidData, featureImportance } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { FlaskConical, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis } from "recharts";

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
          <span className="font-mono font-medium">{typeof p.value === 'number' ? p.value.toFixed(3) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const config = {
    high: { color: "bg-destructive/10 text-destructive", icon: AlertTriangle },
    moderate: { color: "bg-chart-4/10 text-chart-4", icon: Info },
    low: { color: "bg-accent/10 text-accent", icon: CheckCircle },
  };
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase", c.color)}>
      <c.icon className="h-3 w-3" />
      {status}
    </span>
  );
};

const amyloidFeatures = featureImportance.filter(f => f.category === "amyloid");

const radarData = amyloidData.map(d => ({
  region: d.region.replace(" Cortex", "").replace(" Lobe", ""),
  suvr: d.suvr,
  fullMark: 2.5,
}));

export default function AmyloidAnalysis() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="h-4 w-4 text-primary" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Amyloid-β Pathway</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Amyloid Plaque Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">Neural network interpretation of amyloid-β42/40 ratios and PET SUVr across brain regions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card rounded-xl border border-destructive/20 p-4 glow-destructive">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Mean Aβ42/40 Ratio</p>
          <p className="text-xl font-bold mt-1 font-mono">0.052</p>
          <p className="text-[11px] text-destructive mt-1">Below threshold (&lt;0.06)</p>
        </div>
        <div className="bg-card rounded-xl border border-destructive/20 p-4 glow-destructive">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Peak SUVr</p>
          <p className="text-xl font-bold mt-1 font-mono">2.12</p>
          <p className="text-[11px] text-destructive mt-1">Precuneus (amyloid+)</p>
        </div>
        <div className="bg-card rounded-xl border border-primary/20 p-4 glow-primary">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Regions Above Cutoff</p>
          <p className="text-xl font-bold mt-1 font-mono">5/8</p>
          <p className="text-[11px] text-primary mt-1">SUVr &gt; 1.5 threshold</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">DNN Feature Weight</p>
          <p className="text-xl font-bold mt-1 font-mono">0.185</p>
          <p className="text-[11px] text-muted-foreground mt-1">Highest importance</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* SUVr by Region */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-1">Amyloid PET SUVr by Brain Region</h3>
          <p className="text-xs text-muted-foreground mb-4">Standardized uptake value ratio (cutoff: 1.5 SUVr)</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={amyloidData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 2.5]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="region" type="category" width={100} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="suvr" name="SUVr" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-px flex-1 bg-destructive/30" style={{ marginLeft: '100px' }} />
            <span className="text-[10px] text-destructive font-mono">Positivity Cutoff: 1.5</span>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-1">Regional Amyloid Distribution Pattern</h3>
          <p className="text-xs text-muted-foreground mb-4">Spatial pattern of amyloid accumulation across cortical regions</p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="region" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis tick={{ fontSize: 9 }} domain={[0, 2.5]} />
              <Radar name="SUVr" dataKey="suvr" stroke="hsl(199, 89%, 48%)" fill="hsl(199, 89%, 48%)" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Importance for Amyloid */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-1">DNN Feature Importance — Amyloid Biomarkers</h3>
        <p className="text-xs text-muted-foreground mb-4">SHAP-based explanation of how amyloid features contribute to the model's prediction</p>
        <div className="space-y-3">
          {amyloidFeatures.map((f, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-40 shrink-0">{f.feature}</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${f.importance * 100 / 0.185 * 100}%`, maxWidth: '100%' }}
                />
              </div>
              <span className="text-xs font-mono font-bold w-12 text-right">{(f.importance * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border border-border p-6 overflow-x-auto">
        <h3 className="text-sm font-semibold mb-4">Regional Amyloid Biomarker Data</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-muted-foreground">Region</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Aβ42 (pg/mL)</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Aβ40 (pg/mL)</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">Ratio</th>
              <th className="text-right py-3 px-2 font-medium text-muted-foreground">PET SUVr</th>
              <th className="text-center py-3 px-2 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {amyloidData.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-3 px-2 font-medium">{row.region}</td>
                <td className="py-3 px-2 text-right font-mono">{row.abeta42}</td>
                <td className="py-3 px-2 text-right font-mono">{row.abeta40}</td>
                <td className="py-3 px-2 text-right font-mono">{row.ratio.toFixed(3)}</td>
                <td className="py-3 px-2 text-right font-mono font-bold">{row.suvr.toFixed(2)}</td>
                <td className="py-3 px-2 text-center"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}