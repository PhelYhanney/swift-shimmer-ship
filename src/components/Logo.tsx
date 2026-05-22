export function Logo({ className = "", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 20 L20 4 L36 20 L28 28 L20 20 L12 28 Z" fill={color} />
      <circle cx="32" cy="8" r="3" fill={color} opacity="0.6" />
    </svg>
  );
}

export function LogoMark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <Logo className="h-8 w-8" color="var(--primary)" />
      <span
        className={`text-2xl font-bold tracking-tight ${
          light ? "text-navy-foreground" : "text-navy"
        }`}
        style={{ fontFamily: "Plus Jakarta Sans" }}
      >
        Transpo
      </span>
    </div>
  );
}