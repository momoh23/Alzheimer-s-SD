import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function MetricCard({ title, value, subtitle, trend, icon: Icon, variant = "default", className }) {
  const variants = {
    default: "border-border",
    primary: "border-primary/20 glow-primary",
    accent: "border-accent/20 glow-accent",
    secondary: "border-secondary/20 glow-secondary",
    destructive: "border-destructive/20 glow-destructive",
  };

  const trendIcons = {
    up: <TrendingUp className="h-3 w-3 text-destructive" />,
    down: <TrendingDown className="h-3 w-3 text-accent" />,
    stable: <Minus className="h-3 w-3 text-muted-foreground" />,
  };

  return (
    <div className={cn(
      "bg-card rounded-xl border p-5 transition-all duration-300 hover:translate-y-[-2px]",
      variants[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
      <div className="flex items-center gap-2">
        {trend && trendIcons[trend]}
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
    </div>
  );
}