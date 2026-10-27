import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { ShieldIcon } from "./icons";

const links = [
  { href: "/#tipos-de-viaje", label: "Tipos de viaje" },
  { href: "/#promociones", label: "Promociones" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/#opiniones", label: "Opiniones" },
  { href: "/#contacto", label: "Contacto" },
];

export function SiteHeader({ rnt }: { rnt: string }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md">
      <div className="wrap flex items-center gap-5 py-2">
        <Link href="/" aria-label={`${site.name}, inicio`}>
          <Image src="/images/logo.png" alt={`${site.name}, agencia de viajes`} width={153} height={46} priority className="h-[46px] w-auto" />
        </Link>
        <nav aria-label="Secciones" className="ml-auto hidden gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full px-3 py-2 text-sm font-semibold text-muted no-underline hover:bg-bg hover:text-navy">
              {l.label}
            </Link>
          ))}
        </nav>
        <span
          className="ml-auto inline-flex items-center gap-2 rounded-full bg-yellow px-4 py-2 text-sm font-extrabold tracking-wide text-navy md:ml-0"
          title="Registro Nacional de Turismo"
        >
          <ShieldIcon className="size-[18px]" />
          RNT {rnt}
        </span>
      </div>
    </header>
  );
}
