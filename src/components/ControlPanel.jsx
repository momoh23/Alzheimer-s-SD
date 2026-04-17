import { useState, useRef } from "react";
import { useApp } from "@/lib/AppContext";
import { cn } from "@/lib/utils";
import {
  Users, Cpu, Settings, Upload, ChevronDown, ChevronUp,
  X, FileText, CheckCircle, Sliders
} from "lucide-react";

function PatientSelector() {
  const { patient, patients, setSelectedPatientId } = useApp();
  const [open, setOpen] = useState(false);

  const riskColor = (r) => {
    if (r < 0.3) return "text-accent";
    if (r < 0.6) return "text-chart-4";
    return "text-destructive";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-sidebar-accent border border-sidebar-border rounded-lg px-3 py-2 text-xs hover:bg-sidebar-accent/80 transition-colors w-full"
      >
        <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
          {patient.avatar}
        </div>
        <div className="flex-1 text-left">
          <p className="font-medium text-sidebar-foreground truncate">{patient.name}</p>
          <p className="text-[10px] text-sidebar-foreground/50 font-mono">{patient.id}</p>
        </div>
        {open ? <ChevronUp className="h-3 w-3 text-sidebar-foreground/50 shrink-0" /> : <ChevronDown className="h-3 w-3 text-sidebar-foreground/50 shrink-0" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-sidebar border border-sidebar-border rounded-lg shadow-xl z-50 overflow-hidden">
          {patients.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPatientId(p.id); setOpen(false); }}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2.5 text-xs hover:bg-sidebar-accent transition-colors",
                p.id === patient.id && "bg-sidebar-accent"
              )}
            >
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary shrink-0">
                {p.avatar}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-sidebar-foreground">{p.name}</p>
                <p className="text-[10px] text-sidebar-foreground/40">{p.age}{p.sex[0]} · {p.stage}</p>
              </div>
              <span className={cn("text-[10px] font-mono font-bold", riskColor(p.riskScore))}>
                {(p.riskScore * 100).toFixed(0)}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ModelSelector() {
  const { model, dnnModels, setSelectedModelId } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-sidebar-accent border border-sidebar-border rounded-lg px-3 py-2 text-xs hover:bg-sidebar-accent/80 transition-colors w-full"
      >
        <Cpu className="h-4 w-4 text-primary shrink-0" />
        <div className="flex-1 text-left">
          <p className="font-medium text-sidebar-foreground truncate">{model.name}</p>
          <p className="text-[10px] text-sidebar-foreground/50 font-mono">AUC {model.auc.toFixed(3)}</p>
        </div>
        {open ? <ChevronUp className="h-3 w-3 shrink-0" /> : <ChevronDown className="h-3 w-3 shrink-0" />}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-sidebar border border-sidebar-border rounded-lg shadow-xl z-50 overflow-hidden">
          {dnnModels.map((m) => (
            <button
              key={m.id}
              onClick={() => { setSelectedModelId(m.id); setOpen(false); }}
              className={cn(
                "flex items-start gap-2 w-full px-3 py-3 text-xs hover:bg-sidebar-accent transition-colors text-left",
                m.id === model.id && "bg-sidebar-accent"
              )}
            >
              <div className="flex-1">
                <p className="font-medium text-sidebar-foreground">{m.name}</p>
                <p className="text-[10px] text-sidebar-foreground/40 mt-0.5 leading-tight">{m.description}</p>
                <p className="text-[10px] font-mono text-primary mt-1">AUC {m.auc.toFixed(3)} · Acc {(m.accuracy * 100).toFixed(1)}%</p>
              </div>
              {m.id === model.id && <CheckCircle className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ParamSlider({ label, paramKey, min, max, step, unit }) {
  const { params, updateParam } = useApp();
  const value = params[paramKey];
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-[10px] text-sidebar-foreground/60">{label}</span>
        <span className="text-[10px] font-mono text-primary">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => updateParam(paramKey, parseFloat(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-sidebar-border"
        style={{ accentColor: "hsl(199, 89%, 48%)" }}
      />
    </div>
  );
}

function ParamsPanel() {
  const { params, updateParam } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full text-[11px] text-sidebar-foreground/60 hover:text-sidebar-foreground px-1 py-1 transition-colors"
      >
        <Sliders className="h-3.5 w-3.5" />
        <span>Model Parameters</span>
        {open ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
      </button>

      {open && (
        <div className="mt-2 space-y-3 bg-sidebar-accent rounded-lg p-3 border border-sidebar-border">
          <ParamSlider label="Dropout Rate" paramKey="dropoutRate" min={0.1} max={0.6} step={0.05} unit="" />
          <ParamSlider label="Threshold" paramKey="threshold" min={0.3} max={0.8} step={0.05} unit="" />
          <ParamSlider label="Temporal Window" paramKey="temporalWindow" min={3} max={12} step={1} unit=" mo" />
          <ParamSlider label="SHAP Smoothing" paramKey="shapSmoothing" min={0.0} max={0.5} step={0.05} unit="" />

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-sidebar-foreground/60">Batch Size</span>
              <span className="text-[10px] font-mono text-primary">{params.batchSize}</span>
            </div>
            <div className="flex gap-1">
              {[16, 32, 64, 128].map(b => (
                <button
                  key={b}
                  onClick={() => updateParam("batchSize", b)}
                  className={cn(
                    "flex-1 py-0.5 rounded text-[10px] font-mono transition-colors",
                    params.batchSize === b ? "bg-primary text-white" : "bg-sidebar-border text-sidebar-foreground/60 hover:bg-sidebar-border/80"
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] text-sidebar-foreground/60">Learning Rate</span>
              <span className="text-[10px] font-mono text-primary">{params.learningRate}</span>
            </div>
            <div className="flex gap-1">
              {["1e-5", "1e-4", "1e-3"].map(lr => (
                <button
                  key={lr}
                  onClick={() => updateParam("learningRate", lr)}
                  className={cn(
                    "flex-1 py-0.5 rounded text-[10px] font-mono transition-colors",
                    params.learningRate === lr ? "bg-primary text-white" : "bg-sidebar-border text-sidebar-foreground/60 hover:bg-sidebar-border/80"
                  )}
                >
                  {lr}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DataUpload() {
  const { uploadedData, setUploadedData } = useApp();
  const fileRef = useRef();
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedData({ name: file.name, size: file.size, loaded: true, preview: e.target.result?.slice(0, 200) });
    };
    reader.readAsText(file);
  };

  if (uploadedData?.loaded) {
    return (
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-sidebar-foreground truncate">{uploadedData.name}</p>
            <p className="text-[10px] text-sidebar-foreground/40">{(uploadedData.size / 1024).toFixed(1)} KB · Custom dataset</p>
          </div>
          <button onClick={() => setUploadedData(null)} className="text-sidebar-foreground/40 hover:text-destructive transition-colors shrink-0">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border border-dashed rounded-lg p-3 text-center cursor-pointer transition-all",
        dragging ? "border-primary bg-primary/5" : "border-sidebar-border hover:border-primary/50 hover:bg-sidebar-accent"
      )}
      onClick={() => fileRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
    >
      <input ref={fileRef} type="file" accept=".csv,.json,.xlsx" className="hidden" onChange={e => handleFile(e.target.files[0])} />
      <Upload className="h-4 w-4 mx-auto text-sidebar-foreground/30 mb-1" />
      <p className="text-[10px] text-sidebar-foreground/50">Drop CSV / JSON / Excel</p>
      <p className="text-[9px] text-sidebar-foreground/30 mt-0.5">or click to browse</p>
    </div>
  );
}

export default function ControlPanel() {
  return (
    <div className="space-y-4 px-3 py-4 border-t border-sidebar-border">
      {/* Patient */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Users className="h-3.5 w-3.5 text-sidebar-foreground/40" />
          <span className="text-[10px] font-mono text-sidebar-foreground/40 uppercase tracking-widest">Patient</span>
        </div>
        <PatientSelector />
      </div>

      {/* Model */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Cpu className="h-3.5 w-3.5 text-sidebar-foreground/40" />
          <span className="text-[10px] font-mono text-sidebar-foreground/40 uppercase tracking-widest">Model</span>
        </div>
        <ModelSelector />
      </div>

      {/* Parameters */}
      <ParamsPanel />

      {/* Data Upload */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Upload className="h-3.5 w-3.5 text-sidebar-foreground/40" />
          <span className="text-[10px] font-mono text-sidebar-foreground/40 uppercase tracking-widest">Data</span>
        </div>
        <DataUpload />
      </div>
    </div>
  );
}