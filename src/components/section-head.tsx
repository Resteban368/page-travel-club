import type { ReactNode } from "react";

export function SectionHead({ eyebrow, title, accent, intro, dark }: { eyebrow: string; title: ReactNode; accent?: string; intro?: string; dark?: boolean }) {
  return (
    <div className="mb-[34px] text-center">
      <p className="text-xs font-bold tracking-[0.24em] text-sky">{eyebrow}</p>
      <h2 className={`mt-2 text-[clamp(28px,4vw,42px)] leading-[1.1] font-extrabold ${dark ? "text-white" : "text-navy"}`}>
        {title} {accent && <span className="text-yellow">{accent}</span>}
      </h2>
      {intro && <p className={`mx-auto mt-2.5 max-w-[52ch] ${dark ? "text-mist" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}
