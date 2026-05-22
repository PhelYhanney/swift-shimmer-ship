export function PageHero({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) {
  return (
    <section className="relative overflow-hidden bg-navy py-20 text-navy-foreground">
      <div className="absolute -right-32 top-1/4 h-72 w-72 rounded-full border border-white/10 animate-spin-slow" />
      <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="mb-3 text-xs font-bold uppercase tracking-widest text-primary animate-fade-in">{eyebrow}</div>
        <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl animate-fade-up">{title}</h1>
        <p className="mx-auto max-w-2xl text-white/75 animate-fade-up">{desc}</p>
      </div>
    </section>
  );
}
