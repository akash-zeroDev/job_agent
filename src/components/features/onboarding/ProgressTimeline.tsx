"use client";

import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const steps = [
  { id: 1, name: 'Resume', path: '/onboarding' },
  { id: 2, name: 'Digital Footprint', path: '/onboarding/step-2' },
  { id: 3, name: 'Preferences', path: '/onboarding/step-3' },
];

export function ProgressTimeline() {
  const pathname = usePathname();
  
  const currentStepIndex = steps.findIndex(s => s.path === pathname) || 0;
  
  return (
    <div className="w-full max-w-3xl mx-auto mb-12 relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted -z-10 -translate-y-1/2 rounded-full" />
      <div 
        className="absolute top-1/2 left-0 h-0.5 bg-primary -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out rounded-full"
        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
      />
      
      <div className="flex justify-between w-full">
        {steps.map((step, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted || isCurrent ? 'var(--primary)' : 'var(--muted)',
                  borderColor: isCurrent ? 'var(--primary-foreground)' : 'transparent',
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-4",
                  isCompleted ? "bg-primary text-primary-foreground" : 
                  isCurrent ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" : 
                  "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span>{step.id}</span>}
              </motion.div>
              <span className={cn(
                "mt-3 text-sm font-medium transition-colors",
                isCurrent ? "text-primary" : "text-muted-foreground"
              )}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
