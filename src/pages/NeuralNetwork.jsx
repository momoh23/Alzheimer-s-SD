import { featureImportance, neuralNetworkLayers, modelPerformance, attentionWeights } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Network, Cpu, Layers, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-xl text-xs">
      <p className="font-medium mb-1">{payload[0].payload.feature}</p>
      <p className="text-muted-foreground">Importance: <span className="font-mono font-bold">{(payload[0].value * 100).toFixed(1)}%</span></p>
      <p className="text-muted-foreground">Category: <span className="capitalize">{payload[0].payload.category}</span></p>
    </div>);

};

const categoryColors = {
  amyloid: "hsl(199, 89%, 48%)",
  tau: "hsl(250, 60%, 58%)",
  metabolic: "hsl(168, 76%, 42%)",
  structural: "hsl(36, 95%, 58%)",
  neurodegeneration: "hsl(0, 84%, 60%)",
  genetic: "hsl(280, 65%, 60%)",
  neuroinflammation: "hsl(340, 75%, 55%)"
};

const attentionPairs = Object.entries(attentionWeights).map(([key, value]) => {
  const label = key.replace(/([A-Z])/g, ' $1').replace('To', ' → ');
  return { pair: label, weight: value };
});

export default function NeuralNetwork() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Network className="h-4 w-4 text-chart-4" />
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Model Architecture</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Neural Network Explainability</h1>
        <p className="text-sm text-muted-foreground mt-1">Deep learning model architecture, feature importance (SHAP), and attention mechanism analysis</p>
      </div>

      {/* Model Performance */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Object.entries(modelPerformance).map(([key, val]) =>
        <div key={key} className="bg-card rounded-xl border border-border p-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-xl font-bold font-mono mt-1">{(val * 100).toFixed(1)}%</p>
          </div>
        )}
      </div>

      {/* Architecture Detail */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-1">
          <Layers className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">Network Architecture Detail</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">7-layer deep neural network with self-attention for multimodal AD biomarker integration</p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Layer</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Neurons</th>
                <th className="text-center py-3 px-3 font-medium text-muted-foreground">Activation</th>
                <th className="text-center py-3 px-3 font-medium text-muted-foreground">Dropout</th>
                <th className="text-left py-3 px-3 font-medium text-muted-foreground">Description</th>
                <th className="text-right py-3 px-3 font-medium text-muted-foreground">Parameters</th>
              </tr>
            </thead>
            <tbody>
              {neuralNetworkLayers.map((layer, i) => {
                const prevNeurons = i > 0 ? neuralNetworkLayers[i - 1].neurons : 0;
                const params = i === 0 ? layer.neurons : prevNeurons * layer.neurons + layer.neurons;
                return (
                  <tr key={i} className={cn(
                    "border-b border-border/50 transition-colors",
                    layer.name === "Attention" && "bg-primary/5"
                  )}>
                    <td className="py-3 px-3 font-medium">{layer.name}</td>
                    <td className="py-3 px-3 text-right font-mono">{layer.neurons}</td>
                    <td className="py-3 px-3 text-center">
                      {layer.activation ?
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[10px] font-mono">{layer.activation}</span> :
                      "—"}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{layer.dropout || "—"}</td>
                    <td className="py-3 px-3 text-muted-foreground">{layer.description || "Hidden layer"}</td>
                    <td className="py-3 px-3 text-right font-mono">{params.toLocaleString()}</td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Full Feature Importance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-4 w-4 text-chart-4" />
            <h3 className="text-sm font-semibold">Global Feature Importance (SHAP)</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Contribution of each input feature to the DNN's prediction</p>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={featureImportance} layout="vertical" className="bg-[hsl(var(--foreground))] text-[hsl(var(--sidebar-accent))] recharts-surface">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="feature" type="category" width={150} tick={{ fontSize: 9 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="importance" name="SHAP Importance" radius={[0, 4, 4, 0]}>
                {featureImportance.map((entry, i) =>
                <rect key={i} fill={categoryColors[entry.category]} />
                )}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            {Object.entries(categoryColors).map(([cat, color]) =>
            <div key={cat} className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-[10px] text-muted-foreground capitalize">{cat}</span>
              </div>
            )}
          </div>
        </div>

        {/* Attention Mechanism */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-4 w-4 text-secondary" />
            <h3 className="text-sm font-semibold">Cross-Pathway Attention Weights</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-5">Self-attention mechanism learning inter-pathway dependencies for AD prediction</p>
          
          <div className="space-y-4">
            {attentionPairs.map((a, i) =>
            <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium">{a.pair}</span>
                  <span className="text-xs font-mono font-bold">{a.weight.toFixed(2)}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${a.weight * 100}%`,
                    background: `linear-gradient(90deg, hsl(199, 89%, 48%), hsl(250, 60%, 58%))`
                  }} />
                
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-xs font-semibold mb-2">Interpretation</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              The attention mechanism reveals that <span className="text-foreground font-medium">amyloid → tau</span> has the strongest
              cross-pathway attention (0.82), supporting the amyloid cascade hypothesis where Aβ accumulation
              drives downstream tau hyperphosphorylation. The <span className="text-foreground font-medium">tau → metabolic</span> pathway
              (0.74) indicates metabolic dysfunction amplifies tau pathology through mitochondrial impairment and
              oxidative stress mechanisms.
            </p>
          </div>

          {/* Model Summary */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-[10px] text-muted-foreground">Total Parameters</p>
              <p className="text-sm font-bold font-mono mt-1">142,596</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-[10px] text-muted-foreground">Training Epochs</p>
              <p className="text-sm font-bold font-mono mt-1">250</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-[10px] text-muted-foreground">Learning Rate</p>
              <p className="text-sm font-bold font-mono mt-1">1e-4</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg text-center">
              <p className="text-[10px] text-muted-foreground">Optimizer</p>
              <p className="text-sm font-bold font-mono mt-1">AdamW</p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}