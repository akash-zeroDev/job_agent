"use client";

import { motion } from "framer-motion";
import { CheckCircle2, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

interface Template {
  id: string;
  name: string;
  description: string;
  color: string;
}

const templates: Template[] = [
  { id: "modern", name: "Modern Tech", description: "Clean, ATS-friendly, tailored for modern software roles.", color: "bg-blue-500" },
  { id: "executive", name: "Executive", description: "Classic serif typography for leadership and management.", color: "bg-slate-700" },
  { id: "minimal", name: "Minimal", description: "Barebones and hyper-focused on content. Zero distractions.", color: "bg-zinc-400" },
  { id: "academic", name: "Academic", description: "Standard format for research, publications, and PhDs.", color: "bg-emerald-600" },
  { id: "hardware", name: "Hardware", description: "Optimized for core electronics, embedded, and VLSI.", color: "bg-orange-500" },
];

export function TemplatePicker({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((tpl) => {
        const isSelected = selected === tpl.id;
        
        return (
          <motion.div
            key={tpl.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(tpl.id)}
            className={cn(
              "relative cursor-pointer overflow-hidden rounded-2xl border-2 p-5 text-left transition-colors",
              isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border/50 bg-card hover:border-primary/30"
            )}
          >
            <div className={cn("absolute top-0 left-0 w-1 h-full", tpl.color)} />
            
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <LayoutTemplate className="w-5 h-5 text-muted-foreground" />
              </div>
              {isSelected && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </motion.div>
              )}
            </div>
            
            <h4 className="font-semibold text-foreground mb-1">{tpl.name}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{tpl.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
