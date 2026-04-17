import { createContext, useContext, useState } from "react";

// --- Patient Profiles ---
export const patients = [
  {
    id: "PT-2026-0847",
    name: "Eleanor Voss",
    age: 72,
    sex: "Female",
    apoe4Status: "ε4/ε4 Homozygous",
    cognitiveScore: 22,
    maxCognitiveScore: 30,
    stage: "Mild Cognitive Impairment",
    riskScore: 0.78,
    lastScan: "2026-03-15",
    avatar: "EV",
  },
  {
    id: "PT-2026-0512",
    name: "Robert Harmon",
    age: 68,
    sex: "Male",
    apoe4Status: "ε3/ε4 Heterozygous",
    cognitiveScore: 26,
    maxCognitiveScore: 30,
    stage: "Preclinical AD",
    riskScore: 0.44,
    lastScan: "2026-02-28",
    avatar: "RH",
  },
  {
    id: "PT-2026-0331",
    name: "Yuki Tanaka",
    age: 81,
    sex: "Female",
    apoe4Status: "ε4/ε4 Homozygous",
    cognitiveScore: 16,
    maxCognitiveScore: 30,
    stage: "AD Dementia",
    riskScore: 0.93,
    lastScan: "2026-03-20",
    avatar: "YT",
  },
  {
    id: "PT-2026-0199",
    name: "Carlos Mendez",
    age: 65,
    sex: "Male",
    apoe4Status: "ε3/ε3 Negative",
    cognitiveScore: 29,
    maxCognitiveScore: 30,
    stage: "Normal",
    riskScore: 0.12,
    lastScan: "2026-01-10",
    avatar: "CM",
  },
];

// --- DNN Models ---
export const dnnModels = [
  {
    id: "dnn-v3",
    name: "DNN v3.2 (Default)",
    description: "7-layer DNN with attention — full biomarker panel",
    auc: 0.967,
    accuracy: 0.934,
    sensitivity: 0.912,
    specificity: 0.948,
    f1Score: 0.928,
    precision: 0.945,
    layers: 7,
    params: 142596,
    color: "primary",
  },
  {
    id: "lstm-v2",
    name: "LSTM v2.1 (Longitudinal)",
    description: "Bidirectional LSTM optimized for time-series biomarkers",
    auc: 0.952,
    accuracy: 0.918,
    sensitivity: 0.934,
    specificity: 0.903,
    f1Score: 0.918,
    precision: 0.903,
    layers: 5,
    params: 218430,
    color: "secondary",
  },
  {
    id: "transformer-v1",
    name: "Transformer v1.0 (Experimental)",
    description: "Multi-head attention transformer, cross-modal fusion",
    auc: 0.981,
    accuracy: 0.951,
    sensitivity: 0.948,
    specificity: 0.953,
    f1Score: 0.949,
    precision: 0.951,
    layers: 12,
    params: 486720,
    color: "accent",
  },
  {
    id: "rf-ensemble",
    name: "RF Ensemble (Baseline)",
    description: "Random Forest ensemble — interpretable baseline model",
    auc: 0.891,
    accuracy: 0.872,
    sensitivity: 0.845,
    specificity: 0.898,
    f1Score: 0.869,
    precision: 0.895,
    layers: null,
    params: null,
    color: "chart-4",
  },
];

// --- Default Parameters ---
const defaultParams = {
  dropoutRate: 0.3,
  learningRate: "1e-4",
  batchSize: 32,
  epochs: 250,
  threshold: 0.5,
  shapSmoothing: 0.1,
  temporalWindow: 6,
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0].id);
  const [selectedModelId, setSelectedModelId] = useState(dnnModels[0].id);
  const [params, setParams] = useState(defaultParams);
  const [uploadedData, setUploadedData] = useState(null);

  const patient = patients.find(p => p.id === selectedPatientId);
  const model = dnnModels.find(m => m.id === selectedModelId);

  const updateParam = (key, value) => setParams(prev => ({ ...prev, [key]: value }));

  return (
    <AppContext.Provider value={{
      patient,
      model,
      params,
      uploadedData,
      setUploadedData,
      setSelectedPatientId,
      setSelectedModelId,
      updateParam,
      patients,
      dnnModels,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}