import { metabolicMarkers, featureImportance } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-medium mb-1">{d.name}</p>
      <p className="text-muted-foreground">Value: <span className="font-mono font-medium text-foreground">{d.value} {d.unit}</span></p>
      <p className="text-muted-foreground">Normal: <span className="font-mono">{d.normal}</span></p>
    </div>
  );
};

const trendIcons = {
  increasing: <TrendingUp className="h-3.5 w-3.5 text-destructive" />,
  decreasing: <TrendingDown className="h-3.5 w-3.5 text-destructive" />,
  stable: <Minus className="h-3.5 w-3.5 text-muted-foreground" />,
};

const metabolicFeatures = featureImportance.filter(f => f.category === "metabolic");

const pathways = [
  {
    name: "Glucose Hypometabolism",
    description: "Reduced cerebral glucose uptake impairs neuronal energy production, accelerating amyloid-β aggregation and tau hyperphosphorylation.",
    markers: ["CSF Glucose", "Brain FDG Uptake"],
    impact: "high",
    connection: "Drives amyloid cascade through energy failure",
  },
  {
    name: "Mitochondrial Dysfunction",
    description: "Complex I deficiency leads to increased ROS production, oxidative damage to synaptic proteins, and enhanced tau pathology.",
    markers: ["Mitochondrial Complex I", "Oxidative Stress (8-OHdG)"],
    impact: "high",
    connection: "Amplifies tau phosphorylation via oxidative stress",
  },
  {
    name: "Lipid Dysregulation",
    description: "Elevated ceramides promote amyloidogenic processing of APP and disrupt membrane integrity critical for synaptic function.",
    markers: ["Ceramide C16:0"],
    impact: "moderate",
    connection: "Facilitates amyloid plaque formation",
  },
  {
    name: "Neuroinflammation",
    description: "Microglial activation (sTREM2) creates a feed-forward loop with amyloid and tau, accelerating neurodegeneration.",
    markers: ["Neuroinflammation (sTREM2)"],
    impact: "high",
    connection: "Bridges amyloid and tau pathology",
  },
  {
    name: "Insulin Resistance",
    description: "Brain insulin resistance impairs Aβ clearance by insulin-degrading enzyme and promotes tau hyperphosphorylation via GSK-3β.",
    markers: ["Insulin Resistance (HOMA-IR)"],
    impact: "moderate",
    connection: "Dual effect on amyloid clearance and tau",
  },
];

export default function MetabolicControl() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-4 w-4 text-accent" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Metabolic Panel</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Metabolic Control Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">How metabolic dysregulation drives amyloid plaque formation and tau tangle propagation</p>
      </div>

      {/* Metabolic Marker Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {metabolicMarkers.map((m, i) => {
          const isAbnormal = m.status === "high" || m.status === "low";
          return (
            <div key={i} className={cn(
              "bg-card rounded-xl border p-4 transition-all hover:translate-y-[-2px]",
              isAbnormal ? "border-destructive/20" : "border-accent/20"
            )}>
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-tight max-w-[80%]">{m.name}</p>
                {isAbnormal ? (
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                ) : (
                  <CheckCircle className="h-3.5 w-3.5 text-accent shrink-0" />
                )}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold font-mono">{m.value}</span>
                <span className="text-[10px] text-muted-foreground">{m.unit}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">Normal: {m.normal}</span>
                <div className="flex items-center gap-1">
                  {trendIcons[m.trend]}
                  <span className="text-[10px] text-muted-foreground capitalize">{m.trend}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-1">Metabolic Biomarker Profile</h3>
        <p className="text-xs text-muted-foreground mb-4">Current values relative to normal ranges</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={metabolicMarkers}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 8, angle: -20 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" name="Value" fill="hsl(168, 76%, 42%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Metabolic Pathways → AD Connection */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-1">Metabolic Pathway → AD Pathology Connections</h3>
        <p className="text-xs text-muted-foreground mb-5">DNN-identified mechanistic links between metabolic dysfunction and amyloid/tau pathology</p>
        <div className="space-y-4">
          {pathways.map((p, i) => (
            <div key={i} className={cn(
              "rounded-lg border p-4 transition-all",
              p.impact === "high" ? "border-destructive/20 bg-destructive/5" : "border-chart-4/20 bg-chart-4/5"
            )}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{p.name}</h4>
                    <span className={cn(
                      "text-[9px] font-medium uppercase px-2 py-0.5 rounded-full",
                      p.impact === "high" ? "bg-destructive/10 text-destructive" : "bg-chart-4/10 text-chart-4"
                    )}>
                      {p.impact} impact
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-medium text-primary">→ {p.connection}</span>
                  </div>
                </div>
                <div className="shrink-0 flex flex-wrap gap-1 max-w-[140px]">
                  {p.markers.map((m, j) => (
                    <span key={j} className="text-[9px] bg-muted px-2 py-0.5 rounded font-mono">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold mb-1">DNN Feature Importance — Metabolic Biomarkers</h3>
        <p className="text-xs text-muted-foreground mb-4">Neural network weight attribution for metabolic features in AD prediction</p>
        <div className="space-y-3">
          {metabolicFeatures.map((f, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-44 shrink-0">{f.feature}</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700"
                  style={{ width: `${f.importance * 100 / 0.112 * 100}%`, maxWidth: '100%' }}
                />
              </div>
              <span className="text-xs font-mono font-bold w-12 text-right">{(f.importance * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}