import { AlertCircle } from "lucide-react";

export interface UnderReviewPanelProps {
  message?: string;
  className?: string;
}

export default function UnderReviewPanel({
  message = "Content under owner review for verified flight-test data.",
  className = "",
}: UnderReviewPanelProps) {
  return (
    <div className={`p-8 border border-[#f59e0b]/40 bg-[#f59e0b]/5 rounded-sm text-center my-6 flex flex-col items-center justify-center gap-3 ${className}`}>
      <AlertCircle className="w-6 h-6 text-[#fbbf24]" />
      <p className="text-[#fbbf24] font-mono text-sm max-w-xl">
        {message}
      </p>
    </div>
  );
}
