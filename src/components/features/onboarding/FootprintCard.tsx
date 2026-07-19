"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown, ExternalLink, Loader2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type SyncState = "idle" | "syncing" | "completed" | "failed";

interface FootprintCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  defaultState?: SyncState;
  onConnect?: (value: string) => Promise<void>;
  inputPlaceholder?: string;
  inputType?: "text" | "file";
  accept?: string;
}

export function FootprintCard({
  id,
  title,
  description,
  icon,
  defaultState = "idle",
  onConnect,
  inputPlaceholder,
  inputType = "text",
  accept,
}: FootprintCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [syncState, setSyncState] = useState<SyncState>(defaultState);
  const [inputValue, setInputValue] = useState("");

  const handleConnect = async () => {
    if (!onConnect || !inputValue) return;
    
    setSyncState("syncing");
    try {
      await onConnect(inputValue);
      setSyncState("completed");
      setTimeout(() => setIsExpanded(false), 1500);
    } catch {
      setSyncState("failed");
    }
  };

  const statusColors = {
    idle: "bg-muted text-muted-foreground",
    syncing: "bg-primary/20 text-primary border border-primary/30",
    completed: "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30",
    failed: "bg-destructive/20 text-destructive border border-destructive/30",
  };

  const statusText = {
    idle: "Not Connected",
    syncing: "Syncing...",
    completed: "Connected",
    failed: "Failed",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div 
        className="p-6 cursor-pointer flex items-center justify-between group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-background/80 flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform">
            {icon}
          </div>
          <div>
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={cn("px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5", statusColors[syncState])}>
            {syncState === "syncing" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {syncState === "completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
            {syncState === "failed" && <XCircle className="w-3.5 h-3.5" />}
            {statusText[syncState]}
          </div>
          <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-300", isExpanded && "rotate-180")} />
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border/50 bg-muted/10"
          >
            <div className="p-6 pt-4 flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">{inputPlaceholder || "Enter details"}</label>
                {inputType === "text" ? (
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={inputPlaceholder}
                    disabled={syncState === "syncing" || syncState === "completed"}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all disabled:opacity-50 outline-none"
                  />
                ) : (
                  <input 
                    type="file"
                    accept={accept}
                    disabled={syncState === "syncing" || syncState === "completed"}
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        setInputValue(e.target.files[0].name); // mockup
                      }
                    }}
                    className="w-full bg-background border border-input rounded-lg px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                )}
              </div>
              <button
                onClick={handleConnect}
                disabled={!inputValue || syncState === "syncing" || syncState === "completed"}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95 flex items-center gap-2"
              >
                {syncState === "syncing" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Connect & Sync"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
