import { Outlet, Link, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, Activity, Dna, FlaskConical, Network, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AppProvider } from "@/lib/AppContext";
import ControlPanel from "@/components/ControlPanel";

const navItems = [
  { path: "/", label: "Overview", icon: LayoutDashboard },
  { path: "/amyloid", label: "Amyloid Plaques", icon: FlaskConical },
  { path: "/tau", label: "Tau Tangles", icon: Dna },
  { path: "/metabolic", label: "Metabolic Control", icon: Activity },
  { path: "/network", label: "Neural Network", icon: Network },
  { path: "/assessment", label: "Risk Assessment", icon: FileBarChart },
];

export default function Layout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppProvider>
    <div className="min-h-screen bg-background flex dark">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-foreground tracking-tight">NeuroPredict</h1>
              <p className="text-[10px] text-sidebar-foreground/50 font-mono uppercase tracking-widest">AD Analysis v3.2</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-1 shrink-0">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-primary font-medium"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Scrollable control panel */}
        <div className="flex-1 overflow-y-auto">
          <ControlPanel />
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 shrink-0 border-t border-sidebar-border pt-3">
          <div className="flex items-center gap-2 px-1">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] text-sidebar-foreground/50 font-mono">System Active</span>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-muted">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Brain className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">NeuroPredict</span>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
    </AppProvider>
  );
}