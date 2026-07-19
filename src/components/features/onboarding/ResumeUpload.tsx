"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileText, CheckCircle2, Loader2, FileWarning } from "lucide-react";
import { useRouter } from "next/navigation";

const extractStates = [
  "Uploading Resume...",
  "Reading Sections...",
  "Extracting Experience...",
  "Understanding Skills...",
  "Building Professional Profile...",
];

export function ResumeUpload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStateIndex, setUploadStateIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 20 * 1024 * 1024, // 20MB
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    
    // Simulate progressive AI states
    const interval = setInterval(() => {
      setUploadStateIndex((prev) => {
        if (prev < extractStates.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1500);

    try {
      // Simulate upload & processing time
      await new Promise(r => setTimeout(r, 8000));
      
      // In real implementation:
      // const formData = new FormData();
      // formData.append("file", file);
      // await fetch("/api/onboarding/upload", { method: "POST", body: formData });
      
      router.push("/onboarding/step-2");
    } catch (err) {
      setError("Failed to process resume. Please try again.");
      setIsUploading(false);
      setUploadStateIndex(0);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-card/50 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
        {!isUploading ? (
          <>
            <div
              {...getRootProps()}
              className={`
                relative group overflow-hidden border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ease-out cursor-pointer flex flex-col items-center justify-center text-center
                ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"}
                ${isDragReject ? "border-destructive bg-destructive/5" : ""}
                ${error ? "border-destructive/50" : ""}
              `}
            >
              <input {...getInputProps()} />
              
              <div className="w-20 h-20 mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="text-2xl font-semibold mb-2">
                {isDragActive ? "Drop to upload" : "Drag & drop your resume"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Upload your latest resume to build your foundational AI profile.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                <span className="flex items-center gap-1.5 bg-background px-3 py-1 rounded-full border shadow-sm">
                  <FileText className="w-4 h-4" /> PDF
                </span>
                <span className="flex items-center gap-1.5 bg-background px-3 py-1 rounded-full border shadow-sm">
                  <FileText className="w-4 h-4" /> DOCX
                </span>
                <span className="opacity-50">Up to 20MB</span>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive flex items-center gap-3 text-sm font-medium"
              >
                <FileWarning className="w-5 h-5" />
                {error}
              </motion.div>
            )}

            <AnimatePresence>
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-6"
                >
                  <div className="p-4 rounded-xl border bg-background flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={handleUpload}
                      className="ml-4 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg shadow-md hover:bg-primary/90 hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
                    >
                      Extract Profile
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-primary"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                className="absolute inset-4 rounded-full border-b-2 border-l-2 border-primary/50"
              />
              <Loader2 className="w-8 h-8 text-primary animate-pulse" />
            </div>
            
            <div className="h-8 relative w-full overflow-hidden flex justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={uploadStateIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-lg font-medium text-foreground absolute"
                >
                  {extractStates[uploadStateIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            
            <div className="w-full max-w-sm mt-8 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${((uploadStateIndex + 1) / extractStates.length) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
