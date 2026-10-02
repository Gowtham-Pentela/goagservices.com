interface PlaceholderProps {
  label: string;
  className?: string;
  aspectRatio?: string;
  minHeight?: string;
  width?: string;
}

export default function Placeholder({
  label,
  className = "",
  aspectRatio,
  minHeight = "240px",
  width = "100%",
}: PlaceholderProps) {
  const isDev = Boolean(import.meta.env?.DEV);

  return (
    <div
      role="img"
      aria-label={`Photo placeholder for ${label}`}
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-md border border-[#4ade80]/20 bg-[#0a1511] text-center ${className}`}
      style={{
        width,
        minHeight,
        aspectRatio,
      }}
    >
      {/* Subtle technical grid background */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle central watermark */}
      <div className="relative z-10 flex flex-col items-center gap-2 p-4">
        <div className="w-8 h-8 rounded-full border border-[#4ade80]/30 flex items-center justify-center text-[#4ade80]/40 text-xs font-mono">
          GoAG
        </div>
        <div className="text-[#8aa397] text-xs font-mono tracking-wider uppercase">
          {label}
        </div>
        {isDev && (
          <span className="mt-1 px-2.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[10px] tracking-widest uppercase font-bold">
            REPLACE PHOTO
          </span>
        )}
      </div>
    </div>
  );
}
