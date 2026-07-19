"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TemplatePicker } from "@/components/features/onboarding/TemplatePicker";
import { Loader2, Sparkles } from "lucide-react";

const roles = [
  "Software Engineering",
  "Frontend",
  "Backend",
  "Full Stack",
  "AI Engineer",
  "Machine Learning",
  "Core Electronics",
  "Embedded Systems",
  "VLSI",
  "Data Science",
  "Product",
];

export default function OnboardingStep3Page() {
  const router = useRouter();
  const [template, setTemplate] = useState("modern");
  const [role, setRole] = useState(roles[0]);
  const [isFinishing, setIsFinishing] = useState(false);

  const handleFinish = async () => {
    setIsFinishing(true);
    try {
      // Simulate API Call
      await new Promise(r => setTimeout(r, 2000));
      // await fetch("/api/onboarding/complete", { method: "POST", body: JSON.stringify({ template, role }) });
      router.push("/dashboard"); // Redirect to dashboard
    } catch (e) {
      console.error(e);
      setIsFinishing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      
      <div className="w-full space-y-10">
        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Base Template</h2>
            <p className="text-muted-foreground">Select a default template for your generated resumes.</p>
          </div>
          <TemplatePicker selected={template} onSelect={setTemplate} />
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">Primary Role Focus</h2>
            <p className="text-muted-foreground">This helps our AI prioritize specific skills and experiences for your profile.</p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
            >
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 flex gap-3 text-sm text-primary/80">
              <Sparkles className="w-5 h-5 shrink-0 text-primary" />
              <p>Your master profile is tailored for <strong>{role}</strong> roles. The AI will highlight relevant keywords automatically.</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-12 w-full flex justify-center">
        <button
          onClick={handleFinish}
          disabled={isFinishing}
          className="w-full max-w-md px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:pointer-events-none"
        >
          {isFinishing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Finalizing Profile...
            </>
          ) : (
            "Finish Setup"
          )}
        </button>
      </div>
    </div>
  );
}
