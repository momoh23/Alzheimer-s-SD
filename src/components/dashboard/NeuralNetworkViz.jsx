import { neuralNetworkLayers } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function NeuralNetworkViz() {
  const maxNeurons = 8;

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <h3 className="text-sm font-semibold mb-1">Deep Neural Network Architecture</h3>
      <p className="text-xs text-muted-foreground mb-6">7-layer DNN with attention mechanism for AD stage classification</p>
      
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-4">
        {neuralNetworkLayers.map((layer, i) => {
          const displayNeurons = Math.min(layer.neurons, maxNeurons);
          const isInput = i === 0;
          const isOutput = i === neuralNetworkLayers.length - 1;
          const isAttention = layer.name === "Attention";

          return (
            <div key={i} className="flex flex-col items-center min-w-[60px]">
              {/* Layer visualization */}
              <div className={cn(
                "relative flex flex-col items-center gap-1 p-2 rounded-lg border",
                isAttention ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30",
                isInput && "border-accent/30 bg-accent/5",
                isOutput && "border-chart-4/30 bg-chart-4/5"
              )}>
                {Array.from({ length: displayNeurons }).map((_, j) => (
                  <div
                    key={j}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all",
                      isAttention ? "bg-primary/60" : "bg-muted-foreground/30",
                      isInput && "bg-accent/60",
                      isOutput && "bg-chart-4/60",
                      j % 3 === 0 && "animate-pulse-slow"
                    )}
                    style={{ animationDelay: `${j * 0.3}s` }}
                  />
                ))}
                {layer.neurons > maxNeurons && (
                  <span className="text-[8px] text-muted-foreground font-mono">+{layer.neurons - maxNeurons}</span>
                )}
              </div>

              {/* Layer info */}
              <div className="mt-2 text-center">
                <p className="text-[10px] font-medium truncate max-w-[70px]">{layer.name}</p>
                <p className="text-[9px] text-muted-foreground font-mono">{layer.neurons}n</p>
                {layer.activation && (
                  <p className="text-[8px] text-primary font-mono">{layer.activation}</p>
                )}
              </div>

              {/* Connection lines indicator */}
              {i < neuralNetworkLayers.length - 1 && (
                <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-px bg-border" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}