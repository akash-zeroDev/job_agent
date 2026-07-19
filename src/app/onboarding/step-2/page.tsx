"use client";

import { useRouter } from "next/navigation";
import { Github, Globe, Linkedin, Code2, ArrowRight } from "lucide-react";
import { FootprintCard } from "@/components/features/onboarding/FootprintCard";

export default function OnboardingStep2Page() {
  const router = useRouter();

  const handleMockConnect = async (value: string) => {
    return new Promise<void>((resolve) => setTimeout(resolve, 2500));
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      <div className="w-full space-y-4 mb-10">
        <FootprintCard
          id="github"
          title="GitHub"
          description="Connect your repositories, stars, and contribution graph."
          icon={<Github className="w-6 h-6" />}
          onConnect={handleMockConnect}
          inputPlaceholder="GitHub Username"
        />
        
        <FootprintCard
          id="portfolio"
          title="Portfolio & Blog"
          description="We'll scrape your website for case studies, tech mentions, and blogs."
          icon={<Globe className="w-6 h-6" />}
          onConnect={handleMockConnect}
          inputPlaceholder="https://yourwebsite.com"
        />

        <FootprintCard
          id="linkedin"
          title="LinkedIn Archive"
          description="Upload your LinkedIn data export to enrich your professional history."
          icon={<Linkedin className="w-6 h-6 text-[#0077b5]" />}
          onConnect={handleMockConnect}
          inputPlaceholder="Upload ZIP or CSV"
          inputType="file"
          accept=".zip,.csv"
        />

        <FootprintCard
          id="leetcode"
          title="LeetCode"
          description="Fetch your problem solving stats, contest ratings, and rankings."
          icon={<Code2 className="w-6 h-6 text-[#ffa116]" />}
          onConnect={handleMockConnect}
          inputPlaceholder="LeetCode Username"
        />
      </div>

      <button
        onClick={() => router.push("/onboarding/step-3")}
        className="w-full sm:w-auto px-8 py-3.5 bg-primary text-primary-foreground text-base font-semibold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 group"
      >
        Continue to Preferences
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
