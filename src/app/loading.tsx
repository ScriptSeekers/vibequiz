import { Sparkles } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="relative">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-purple via-vibe-blue to-vibe-pink flex items-center justify-center text-white shadow-md animate-pulse">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Loading Vibe Quiz...
      </p>
    </div>
  );
}
