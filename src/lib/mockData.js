// Simulated neural network biomarker data for Alzheimer's disease

export const patientProfile = {
  id: "PT-2026-0847",
  age: 72,
  sex: "Female",
  apoe4Status: "ε4/ε4 Homozygous",
  cognitiveScore: 22,
  maxCognitiveScore: 30,
  stage: "Mild Cognitive Impairment",
  riskScore: 0.78,
  lastScan: "2026-03-15",
};

export const amyloidData = [
  { region: "Frontal Cortex", abeta42: 385, abeta40: 8200, ratio: 0.047, suvr: 1.92, status: "high" },
  { region: "Temporal Lobe", abeta42: 412, abeta40: 8500, ratio: 0.048, suvr: 1.85, status: "high" },
  { region: "Parietal Cortex", abeta42: 445, abeta40: 8100, ratio: 0.055, suvr: 1.68, status: "moderate" },
  { region: "Occipital Cortex", abeta42: 520, abeta40: 7800, ratio: 0.067, suvr: 1.35, status: "low" },
  { region: "Hippocampus", abeta42: 365, abeta40: 8400, ratio: 0.043, suvr: 2.05, status: "high" },
  { region: "Cingulate", abeta42: 398, abeta40: 8300, ratio: 0.048, suvr: 1.88, status: "high" },
  { region: "Precuneus", abeta42: 375, abeta40: 8600, ratio: 0.044, suvr: 2.12, status: "high" },
  { region: "Striatum", abeta42: 488, abeta40: 7900, ratio: 0.062, suvr: 1.42, status: "moderate" },
];

export const tauData = [
  { region: "Entorhinal Cortex", ptau181: 42.5, ptau217: 8.9, totalTau: 485, braakStage: "III-IV", nftDensity: 0.82 },
  { region: "Hippocampus", ptau181: 38.2, ptau217: 7.6, totalTau: 445, braakStage: "III", nftDensity: 0.75 },
  { region: "Inferior Temporal", ptau181: 35.8, ptau217: 6.8, totalTau: 410, braakStage: "III", nftDensity: 0.68 },
  { region: "Middle Temporal", ptau181: 28.4, ptau217: 5.2, totalTau: 365, braakStage: "II-III", nftDensity: 0.52 },
  { region: "Frontal Cortex", ptau181: 22.1, ptau217: 4.1, totalTau: 310, braakStage: "II", nftDensity: 0.38 },
  { region: "Parietal Cortex", ptau181: 20.5, ptau217: 3.8, totalTau: 290, braakStage: "II", nftDensity: 0.32 },
  { region: "Occipital Cortex", ptau181: 12.3, ptau217: 2.1, totalTau: 185, braakStage: "I", nftDensity: 0.15 },
];

export const metabolicMarkers = [
  { name: "CSF Glucose", value: 58, unit: "mg/dL", normal: "60-80", status: "low", trend: "decreasing" },
  { name: "Brain FDG Uptake", value: 4.2, unit: "SUVr", normal: ">5.0", status: "low", trend: "decreasing" },
  { name: "Lactate/Pyruvate", value: 28, unit: "ratio", normal: "<20", status: "high", trend: "increasing" },
  { name: "Oxidative Stress (8-OHdG)", value: 15.2, unit: "ng/mL", normal: "<8.0", status: "high", trend: "increasing" },
  { name: "Mitochondrial Complex I", value: 62, unit: "%", normal: ">80%", status: "low", trend: "decreasing" },
  { name: "Ceramide C16:0", value: 2.8, unit: "µg/mL", normal: "<2.0", status: "high", trend: "increasing" },
  { name: "Insulin Resistance (HOMA-IR)", value: 3.8, unit: "index", normal: "<2.5", status: "high", trend: "stable" },
  { name: "Neuroinflammation (sTREM2)", value: 12.5, unit: "ng/mL", normal: "<8.0", status: "high", trend: "increasing" },
];

export const neuralNetworkLayers = [
  { name: "Input Layer", neurons: 48, description: "Biomarker features" },
  { name: "Dense 1", neurons: 128, activation: "ReLU", dropout: 0.3 },
  { name: "Dense 2", neurons: 256, activation: "ReLU", dropout: 0.4 },
  { name: "Attention", neurons: 256, description: "Self-attention mechanism" },
  { name: "Dense 3", neurons: 128, activation: "ReLU", dropout: 0.3 },
  { name: "Dense 4", neurons: 64, activation: "ReLU", dropout: 0.2 },
  { name: "Output", neurons: 4, activation: "Softmax", description: "Disease stages" },
];

export const featureImportance = [
  { feature: "Aβ42/40 Ratio (CSF)", importance: 0.185, category: "amyloid" },
  { feature: "p-Tau217 (Plasma)", importance: 0.162, category: "tau" },
  { feature: "Amyloid PET SUVr", importance: 0.148, category: "amyloid" },
  { feature: "p-Tau181 (CSF)", importance: 0.135, category: "tau" },
  { feature: "FDG-PET Uptake", importance: 0.112, category: "metabolic" },
  { feature: "Hippocampal Volume", importance: 0.098, category: "structural" },
  { feature: "Total Tau (CSF)", importance: 0.082, category: "tau" },
  { feature: "NfL (Plasma)", importance: 0.068, category: "neurodegeneration" },
  { feature: "GFAP (Plasma)", importance: 0.058, category: "neurodegeneration" },
  { feature: "Brain Glucose Metabolism", importance: 0.052, category: "metabolic" },
  { feature: "Oxidative Stress Index", importance: 0.042, category: "metabolic" },
  { feature: "APOE4 Status", importance: 0.038, category: "genetic" },
  { feature: "Ceramide Levels", importance: 0.032, category: "metabolic" },
  { feature: "sTREM2 (CSF)", importance: 0.028, category: "neuroinflammation" },
];

export const predictionTimeline = [
  { month: "Sep 2025", amyloidLoad: 0.52, tauBurden: 0.35, cogScore: 26, risk: 0.45 },
  { month: "Oct 2025", amyloidLoad: 0.55, tauBurden: 0.38, cogScore: 25, risk: 0.49 },
  { month: "Nov 2025", amyloidLoad: 0.58, tauBurden: 0.41, cogScore: 25, risk: 0.53 },
  { month: "Dec 2025", amyloidLoad: 0.62, tauBurden: 0.45, cogScore: 24, risk: 0.58 },
  { month: "Jan 2026", amyloidLoad: 0.65, tauBurden: 0.49, cogScore: 24, risk: 0.63 },
  { month: "Feb 2026", amyloidLoad: 0.69, tauBurden: 0.53, cogScore: 23, risk: 0.70 },
  { month: "Mar 2026", amyloidLoad: 0.73, tauBurden: 0.58, cogScore: 22, risk: 0.78 },
  { month: "Apr 2026*", amyloidLoad: 0.76, tauBurden: 0.62, cogScore: 21, risk: 0.82 },
  { month: "May 2026*", amyloidLoad: 0.79, tauBurden: 0.65, cogScore: 20, risk: 0.85 },
  { month: "Jun 2026*", amyloidLoad: 0.82, tauBurden: 0.69, cogScore: 19, risk: 0.88 },
];

export const modelPerformance = {
  accuracy: 0.934,
  sensitivity: 0.912,
  specificity: 0.948,
  auc: 0.967,
  f1Score: 0.928,
  precision: 0.945,
};

export const stageDistribution = [
  { name: "Normal", probability: 0.05, color: "hsl(168, 76%, 42%)" },
  { name: "Preclinical AD", probability: 0.12, color: "hsl(199, 89%, 48%)" },
  { name: "MCI due to AD", probability: 0.68, color: "hsl(36, 95%, 58%)" },
  { name: "AD Dementia", probability: 0.15, color: "hsl(0, 84%, 60%)" },
];

export const attentionWeights = {
  amyloidToTau: 0.82,
  tauToMetabolic: 0.74,
  metabolicToStructural: 0.65,
  amyloidToMetabolic: 0.58,
  geneticToAmyloid: 0.71,
  inflammationToTau: 0.68,
};