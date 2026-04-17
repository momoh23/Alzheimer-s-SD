import { patientProfile, featureImportance, stageDistribution, amyloidData, tauData, metabolicMarkers, predictionTimeline } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import RiskGauge from "@/components/dashboard/RiskGauge";
import { FileBarChart, AlertTriangle, Shield, Brain, ArrowRight, TrendingUp } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-medium mb-2">{label}</p>
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

const topRiskFactors = [
  { factor: "Aβ42/40 Ratio critically low", severity: "critical", detail: "0.047 in frontal cortex (threshold: 0.06)" },
  { factor: "Precuneus amyloid SUVr elevated", severity: "critical", detail: "2.12 SUVr (threshold: 1.5)" },
  { factor: "p-Tau217 elevated", severity: "high", detail: "8.9 pg/mL in entorhinal cortex" },
  { factor: "APOE ε4/ε4 homozygous", severity: "high", detail: "3-8x increased lifetime risk" },
  { factor: "FDG-PET hypometabolism", severity: "high", detail: "4.2 SUVr (threshold: >5.0)" },
  { factor: "Oxidative stress elevated", severity: "moderate", detail: "8-OHdG: 15.2 ng/mL (threshold: <8.0)" },
  { factor: "Mitochondrial Complex I reduced", severity: "moderate", detail: "62% activity (threshold: >80%)" },
  { factor: "sTREM2 neuroinflammation", severity: "moderate", detail: "12.5 ng/mL (threshold: <8.0)" },
];

const recommendations = [
  { title: "Amyloid-Targeted Therapy", desc: "Consider anti-amyloid immunotherapy (lecanemab) given amyloid-positive PET and low Aβ42/40 ratio.", priority: "high" },
  { title: "Tau Monitoring", desc: "Schedule follow-up p-Tau217 plasma assay in 3 months to track tau progression rate.", priority: "high" },
  { title: "Metabolic Intervention", desc: "Optimize glucose metabolism: Mediterranean-MIND diet, aerobic exercise 150min/week, insulin sensitizer evaluation.", priority: "medium" },
  { title: "Neuroprotection", desc: "Antioxidant supplementation (CoQ10, NAC) to address mitochondrial dysfunction and oxidative stress.", priority: "medium" },
  { title: "Cognitive Reserve", desc: "Cognitive stimulation therapy, social engagement, and sleep hygiene optimization.", priority: "medium" },
];

export default function RiskAssessment() {
  const cognitiveData = predictionTimeline.map(d => ({
    month: d.month,
    cogScore: d.cogScore,
    risk: d.risk,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileBarChart className="h-4 w-4 text-chart-4" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Patient Assessment</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Risk Assessment Report</h1>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive DNN-based risk analysis integrating amyloid, tau, and metabolic pathways</p>
      </div>

      {/* Patient Header */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex flex-col items-center justify-center">
            <RiskGauge score={patientProfile.riskScore} size={180} />
            <p className="text-xs text-muted-foreground mt-2">Composite DNN Risk Score</p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase">Patient ID</p>
              <p className="text-sm font-mono font-bold mt-1">{patientProfile.id}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase">Age / Sex</p>
              <p className="text-sm font-bold mt-1">{patientProfile.age}F</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase">APOE Status</p>
              <p className="text-sm font-mono font-bold mt-1 text-destructive">{patientProfile.apoe4Status}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase">MMSE Score</p>
              <p className="text-sm font-bold mt-1">{patientProfile.cognitiveScore}/{patientProfile.maxCognitiveScore}</p>
            </div>
            <div className="p-3 bg-chart-4/10 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase">Current Stage</p>
              <p className="text-sm font-bold mt-1 text-chart-4">{patientProfile.stage}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase">Predicted Stage</p>
              <p className="text-sm font-bold mt-1">MCI → AD (6-12mo)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Cognitive Trajectory */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-1">Predicted Cognitive Trajectory</h3>
          <p className="text-xs text-muted-foreground mb-4">MMSE score projection with risk score overlay (* = predicted)</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cognitiveData}>
              <defs>
                <linearGradient id="gradCog" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cogScore" name="MMSE" stroke="hsl(199, 89%, 48%)" fill="url(#gradCog)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Classification Confidence */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-1">DNN Classification Confidence</h3>
          <p className="text-xs text-muted-foreground mb-5">Softmax output probabilities for each disease stage</p>
          <div className="space-y-4">
            {stageDistribution.map((s, i) => {
              const isMax = s.probability === Math.max(...stageDistribution.map(x => x.probability));
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn("text-xs", isMax ? "font-bold" : "text-muted-foreground")}>{s.name}</span>
                    <span className={cn("text-sm font-mono", isMax ? "font-bold" : "text-muted-foreground")}>
                      {(s.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.probability * 100}%`,
                        backgroundColor: s.color,
                        boxShadow: isMax ? `0 0 10px ${s.color}60` : 'none'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-4 w-4 text-chart-4" />
          <h3 className="text-sm font-semibold">Key Risk Factors Identified by DNN</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Ranked by model attention weight and clinical significance</p>
        <div className="space-y-2">
          {topRiskFactors.map((r, i) => (
            <div key={i} className={cn(
              "flex items-center gap-4 p-3 rounded-lg border transition-all",
              r.severity === "critical" ? "border-destructive/20 bg-destructive/5" :
              r.severity === "high" ? "border-chart-4/20 bg-chart-4/5" :
              "border-border bg-muted/30"
            )}>
              <span className={cn(
                "text-[10px] font-bold uppercase w-16 shrink-0 text-center px-2 py-1 rounded",
                r.severity === "critical" ? "bg-destructive/10 text-destructive" :
                r.severity === "high" ? "bg-chart-4/10 text-chart-4" :
                "bg-muted text-muted-foreground"
              )}>
                {r.severity}
              </span>
              <div className="flex-1">
                <p className="text-xs font-medium">{r.factor}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{r.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DNN Explanation Summary */}
      <div className="bg-card rounded-xl border border-primary/20 p-6 glow-primary">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Neural Network Prediction Explanation</h3>
        </div>
        <div className="mt-4 space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>
            The deep neural network model processes <span className="text-foreground font-medium">48 input biomarkers</span> through
            7 layers with a self-attention mechanism to generate the AD stage prediction. For this patient, the model assigns
            a <span className="text-chart-4 font-bold">68.0% probability to MCI due to AD</span>, driven primarily by:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-[10px] text-primary font-bold uppercase mb-2">Amyloid Pathway (33.3%)</p>
              <p>Low Aβ42/40 ratios and elevated PET SUVr in precuneus and hippocampus indicate significant amyloid burden. The attention layer weights amyloid features most heavily.</p>
            </div>
            <div className="p-4 bg-secondary/5 rounded-lg border border-secondary/10">
              <p className="text-[10px] text-secondary font-bold uppercase mb-2">Tau Pathway (37.9%)</p>
              <p>Elevated p-Tau217 in entorhinal cortex with Braak III-IV staging shows tau spread beyond medial temporal lobe. The model identifies this as the strongest predictor of clinical decline.</p>
            </div>
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/10">
              <p className="text-[10px] text-accent font-bold uppercase mb-2">Metabolic Pathway (28.8%)</p>
              <p>Glucose hypometabolism combined with mitochondrial dysfunction and elevated oxidative stress create a metabolic environment that accelerates both amyloid and tau pathology.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold">Model-Informed Clinical Recommendations</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Based on DNN feature analysis and predicted disease trajectory</p>
        <div className="space-y-3">
          {recommendations.map((r, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/30 transition-all">
              <span className={cn(
                "text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0 mt-0.5",
                r.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-chart-4/10 text-chart-4"
              )}>
                {r.priority}
              </span>
              <div>
                <p className="text-xs font-semibold">{r.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}