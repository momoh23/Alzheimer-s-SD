import { predictionTimeline, modelPerformance as defaultPerf } from "@/lib/mockData";
import { useApp } from "@/lib/AppContext";
import MetricCard from "@/components/dashboard/MetricCard";
import RiskGauge from "@/components/dashboard/RiskGauge";
import NeuralNetworkViz from "@/components/dashboard/NeuralNetworkViz";
import StageDistribution from "@/components/dashboard/StageDistribution";
import { Brain, Activity, Dna, FlaskConical, Shield, Target, Upload, Cpu, AlertCircle } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
      <p className="text-xs font-medium mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-mono font-medium">{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// Simulate per-patient trajectory variance
const getTimeline = (patient) => {
  const scale = patient.riskScore;
  return predictionTimeline.map((d, i) => ({
    ...d,
    risk: Math.min(0.99, d.risk * (scale / 0.78)),
    amyloidLoad: Math.min(0.99, d.amyloidLoad * (scale / 0.78)),
    tauBurden: Math.min(0.99, d.tauBurden * (scale / 0.78)),
    cogScore: Math.max(10, Math.round(d.cogScore * (patient.cognitiveScore / 22))),
  }));
};

export default function Dashboard() {
  const { patient, model, params, uploadedData } = useApp();

  // Derive model performance with slight param-influenced noise
  const dropoutFactor = 1 - (params.dropoutRate - 0.3) * 0.05;
  const modelPerf = {
    auc: Math.min(0.999, model.auc * dropoutFactor),
    sensitivity: Math.min(0.999, model.sensitivity * dropoutFactor),
    specificity: Math.min(0.999, model.specificity),
    f1Score: Math.min(0.999, model.f1Score * dropoutFactor),
    precision: Math.min(0.999, model.precision),
    accuracy: Math.min(0.999, model.accuracy * dropoutFactor),
  };

  const timeline = getTimeline(patient);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Live Analysis</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Alzheimer's Disease Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep neural network metabolic control & prediction system</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono bg-muted px-3 py-1.5 rounded-lg">{patient.id}</span>
          <span className="bg-chart-4/10 text-chart-4 px-3 py-1.5 rounded-lg font-medium">{patient.stage}</span>
          <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1.5 rounded-lg font-medium">
            <Cpu className="h-3 w-3" />
            {model.name.split(" ")[0]} {model.name.split(" ")[1]}
          </span>
          {uploadedData?.loaded && (
            <span className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-lg font-medium">
              <Upload className="h-3 w-3" />
              Custom Data
            </span>
          )}
        </div>
      </div>

      {/* Uploaded Data Banner */}
      {uploadedData?.loaded && (
        <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 rounded-xl px-4 py-3">
          <AlertCircle className="h-4 w-4 text-accent shrink-0" />
          <p className="text-xs text-muted-foreground">
            Custom dataset <span className="text-foreground font-medium">"{uploadedData.name}"</span> loaded —
            results below are simulated using your file as the biomarker input source.
          </p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard title="Risk Score" value={`${(patient.riskScore * 100).toFixed(0)}%`} subtitle="Composite DNN" trend="up" icon={Shield} variant="destructive" />
        <MetricCard title="MMSE Score" value={`${patient.cognitiveScore}/${patient.maxCognitiveScore}`} subtitle="Cognitive index" trend="up" icon={Brain} variant="primary" />
        <MetricCard title="Model AUC" value={modelPerf.auc.toFixed(3)} subtitle="Discrimination" icon={Target} variant="accent" />
        <MetricCard title="Sensitivity" value={`${(modelPerf.sensitivity * 100).toFixed(1)}%`} subtitle="Detection rate" icon={Activity} />
        <MetricCard title="Specificity" value={`${(modelPerf.specificity * 100).toFixed(1)}%`} subtitle="True negatives" icon={FlaskConical} />
        <MetricCard title="F1 Score" value={modelPerf.f1Score.toFixed(3)} subtitle="Harmonic mean" icon={Dna} />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Risk Gauge */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold mb-1 self-start">AD Progression Risk</h3>
          <p className="text-xs text-muted-foreground mb-1 self-start">Neural network composite risk score</p>
          <p className="text-[10px] text-primary font-mono self-start mb-4">
            Patient: {patient.name} · {patient.age}{patient.sex[0]}
          </p>
          <RiskGauge score={patient.riskScore} size={200} />
          <div className="grid grid-cols-2 gap-4 mt-4 w-full">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase">APOE Status</p>
              <p className="text-xs font-mono font-medium mt-1">{patient.apoe4Status}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase">Last Scan</p>
              <p className="text-xs font-mono font-medium mt-1">{patient.lastScan}</p>
            </div>
          </div>

          {/* Model info mini */}
          <div className="w-full mt-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
            <p className="text-[10px] text-muted-foreground uppercase mb-1">Active Model</p>
            <p className="text-xs font-medium text-primary">{model.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{model.description}</p>
          </div>
        </div>

        {/* Prediction Timeline */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-border p-6">
          <h3 className="text-sm font-semibold mb-1">Longitudinal Prediction Trajectory</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Amyloid load, tau burden & risk — window: {params.temporalWindow} mo · threshold: {params.threshold} (* = predicted)
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={timeline}>
              <defs>
                <linearGradient id="gradRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradAmyloid" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="risk" name="Risk Score" stroke="hsl(0, 84%, 60%)" fill="url(#gradRisk)" strokeWidth={2} />
              <Area type="monotone" dataKey="amyloidLoad" name="Amyloid Load" stroke="hsl(199, 89%, 48%)" fill="url(#gradAmyloid)" strokeWidth={2} />
              <Line type="monotone" dataKey="tauBurden" name="Tau Burden" stroke="hsl(250, 60%, 58%)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <NeuralNetworkViz />
        <StageDistribution patient={patient} />
      </div>
    </div>
  );
}