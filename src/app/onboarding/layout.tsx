import { ReactNode } from "react";
import { ProgressTimeline } from "@/components/features/onboarding/ProgressTimeline";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background via-background to-muted">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Build Your AI Identity
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's create your master professional profile. This permanent knowledge base powers all future AI features, from resume generation to career analytics.
          </p>
        </div>
        
        <ProgressTimeline />
        
        <main className="mt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
