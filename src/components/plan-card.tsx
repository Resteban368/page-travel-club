import Link from "next/link";
import { waLink } from "@/lib/site";
import type { Plan } from "@/lib/types";
import { Flyer } from "./flyer";
import { WhatsAppIcon } from "./icons";

export const badgeColors = {
  yellow: "bg-yellow text-navy",
  sky: "bg-sky text-white",
  green: "bg-green text-white",
  navy: "bg-navy text-white",
} as const;

export function PlanCard({ plan, priority }: { plan: Plan; priority?: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_24px_44px_-32px_rgb(10_42_92/0.7)]">
      <div className="relative">
        <Flyer src={plan.image} alt={`Flyer ${plan.title}`} sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, 360px" priority={priority} />
        <span className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-extrabold tracking-wider ${badgeColors[plan.badge.color]}`}>
          {plan.badge.label}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-[18px] pt-4 pb-[18px]">
        <h3 className="text-[17px] leading-tight font-bold text-navy">
          <Link href={`/planes/${plan.slug}`} className="hover:text-blue hover:underline">
            {plan.title}
          </Link>
          <small className="block text-[13px] font-medium text-muted">{plan.subtitle}</small>
        </h3>
        <a className="btn btn-wa btn-sm" href={waLink(plan.whatsappText)} target="_blank" rel="noopener">
          <WhatsAppIcon className="size-[19px]" />
          Reservar
        </a>
      </div>
    </article>
  );
}
