import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count <= 0) {
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCount((c) => c - 1), 800);
    return () => clearTimeout(t);
  }, [count, onDone]);

  const progress = ((3 - count) / 3) * 100;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-navy transition-opacity duration-500 ${
        count <= 0 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 -m-6 rounded-full border-2 border-primary/30 animate-spin-slow" />
        <div className="absolute inset-0 -m-6 rounded-full border-t-2 border-primary animate-spin" />
        <div className="rounded-full bg-primary/10 p-6 backdrop-blur-sm">
          <Logo className="h-16 w-16 animate-scale-in" color="var(--primary)" />
        </div>
      </div>
      <h2
        className="mb-2 text-3xl font-bold text-navy-foreground tracking-tight"
        style={{ fontFamily: "Plus Jakarta Sans" }}
      >
        Transpo
      </h2>
      <p className="mb-8 text-sm text-white/60">Preparing your logistics journey</p>
      <div
        key={count}
        className="mb-4 text-7xl font-bold text-primary animate-scale-in"
        style={{ fontFamily: "Plus Jakarta Sans" }}
      >
        {count > 0 ? count : "Go!"}
      </div>
      <div className="h-1 w-64 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-gradient-hero transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}