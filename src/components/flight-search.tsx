"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { type Airport, airportLabel, airports, searchAirports } from "@/lib/airports";
import { waLink } from "@/lib/site";
import { PlaneIcon, WhatsAppIcon } from "./icons";

type Trip = "ida-vuelta" | "solo-ida";
type Cabin = "Económica" | "Premium económica" | "Ejecutiva";

const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

// La fecha de hoy solo se lee en el navegador (en el servidor la página se pre-renderiza).
const noopSubscribe = () => () => {};
const useToday = () => useSyncExternalStore(noopSubscribe, todayISO, () => "");

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("es-CO", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

/* ---------- Campo de aeropuerto con autocompletado ---------- */
function AirportField({
  label,
  value,
  onChange,
  exclude,
  placeholder,
  icon,
}: {
  label: string;
  value: Airport | null;
  onChange: (a: Airport | null) => void;
  exclude?: string;
  placeholder: string;
  icon: "despegue" | "aterrizaje";
}) {
  const id = useId();
  const [text, setText] = useState(value ? airportLabel(value) : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState(value);
  if (prev !== value) {
    setPrev(value);
    setText(value ? airportLabel(value) : "");
  }
  const results = open ? searchAirports(value && text === airportLabel(value) ? "" : text, exclude) : [];

  const pick = (a: Airport) => {
    onChange(a);
    setText(airportLabel(a));
    setOpen(false);
  };

  return (
    <div className="relative min-w-0">
      <label htmlFor={id} className="fs-label">
        {label}
      </label>
      <div className="fs-box">
        <PlaneIcon className={`size-5 flex-none text-sky ${icon === "aterrizaje" ? "rotate-45" : "-rotate-45"}`} />
        <input
          id={id}
          role="combobox"
          aria-expanded={open && results.length > 0}
          aria-controls={`${id}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${id}-${results[active].code}` : undefined}
          autoComplete="off"
          placeholder={placeholder}
          value={text}
          onFocus={(e) => {
            e.currentTarget.select();
            setOpen(true);
            setActive(0);
          }}
          onBlur={() => {
            setOpen(false);
            setText(value ? airportLabel(value) : "");
          }}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
            setActive(0);
            if (!e.target.value) onChange(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter" && open && results[active]) {
              e.preventDefault();
              pick(results[active]);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          className="fs-input"
        />
      </div>
      {open && results.length > 0 && (
        <ul id={`${id}-list`} role="listbox" className="absolute top-full right-0 left-0 z-30 mt-2 max-h-80 overflow-auto rounded-2xl bg-white p-1.5 shadow-lift ring-1 ring-line sm:min-w-[320px]">
          {results.map((a, i) => (
            <li
              key={a.code}
              id={`${id}-${a.code}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(a);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 ${i === active ? "bg-bg" : ""}`}
            >
              <span className="grid h-9 w-12 flex-none place-items-center rounded-lg bg-navy text-[13px] font-bold tracking-wide text-white">{a.code}</span>
              <span className="min-w-0">
                <b className="block truncate text-[15px] text-navy">{a.city}</b>
                <span className="block truncate text-[13px] text-muted">
                  {a.name} · {a.country}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Contador de pasajeros ---------- */
function Counter({ label, hint, value, min, max, onChange }: { label: string; hint: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <b className="block text-[15px] text-navy">{label}</b>
        <span className="text-[13px] text-muted">{hint}</span>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" className="fs-step" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Quitar ${label.toLowerCase()}`}>
          −
        </button>
        <span className="w-5 text-center font-bold text-navy tabular-nums" aria-live="polite">
          {value}
        </span>
        <button type="button" className="fs-step" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Agregar ${label.toLowerCase()}`}>
          +
        </button>
      </div>
    </div>
  );
}

/* ---------- Buscador ---------- */
export function FlightSearch() {
  const [trip, setTrip] = useState<Trip>("ida-vuelta");
  const [from, setFrom] = useState<Airport | null>(airports.find((a) => a.code === "BOG") ?? null);
  const [to, setTo] = useState<Airport | null>(null);
  const [depart, setDepart] = useState("");
  const [ret, setRet] = useState("");
  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [babies, setBabies] = useState(0);
  const [cabin, setCabin] = useState<Cabin>("Económica");
  const [bag, setBag] = useState(true);
  const [flexible, setFlexible] = useState(false);
  const [paxOpen, setPaxOpen] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const paxRef = useRef<HTMLDivElement>(null);
  const today = useToday();
  const travelers = adults + kids + babies;

  useEffect(() => {
    if (!paxOpen) return;
    const close = (e: MouseEvent) => {
      if (!paxRef.current?.contains(e.target as Node)) setPaxOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setPaxOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [paxOpen]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!from || !to) return setError("Elige la ciudad de origen y la de destino.");
    if (from.code === to.code) return setError("El origen y el destino deben ser distintos.");
    if (!depart) return setError("Elige la fecha de ida.");
    if (trip === "ida-vuelta" && !ret) return setError("Elige la fecha de regreso o cambia a «Solo ida».");
    if (trip === "ida-vuelta" && ret < depart) return setError("La fecha de regreso debe ser después de la ida.");
    setError("");

    const pax = [`${adults} adulto${adults > 1 ? "s" : ""}`, kids && `${kids} niño${kids > 1 ? "s" : ""}`, babies && `${babies} bebé${babies > 1 ? "s" : ""}`]
      .filter(Boolean)
      .join(", ");
    const msg = [
      "¡Hola Travel Club! ✈️ Quiero cotizar este vuelo:",
      "",
      `🛫 Origen: ${from.city} (${from.code})`,
      `🛬 Destino: ${to.city} (${to.code})`,
      `🔁 Tipo: ${trip === "ida-vuelta" ? "Ida y vuelta" : "Solo ida"}`,
      `📅 Ida: ${fmtDate(depart)}`,
      trip === "ida-vuelta" ? `📅 Regreso: ${fmtDate(ret)}` : "",
      `👥 Pasajeros: ${pax}`,
      `💺 Cabina: ${cabin}`,
      `🧳 Maleta de bodega: ${bag ? "Sí" : "No, solo equipaje de mano"}`,
      flexible ? "🗓️ Tengo flexibilidad de ± 3 días en las fechas" : "",
    ]
      .filter((l) => l !== "")
      .join("\n");
    const href = waLink(msg);
    const win = window.open(href, "_blank", "noopener");
    if (!win) window.location.href = href;
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="relative rounded-[26px] bg-white p-5 shadow-lift ring-1 ring-line sm:p-7" aria-labelledby="fs-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="fs-title" className="flex items-center gap-2.5 text-[21px] font-extrabold text-navy">
          <span className="grid size-10 place-items-center rounded-xl bg-sky">
            <PlaneIcon className="size-[22px] text-white" />
          </span>
          Cotiza tu vuelo
        </h2>
        <div role="radiogroup" aria-label="Tipo de viaje" className="flex rounded-full bg-bg p-1">
          {(
            [
              ["ida-vuelta", "Ida y vuelta"],
              ["solo-ida", "Solo ida"],
            ] as const
          ).map(([k, l]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={trip === k}
              onClick={() => setTrip(k)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${trip === k ? "bg-navy text-white shadow" : "text-muted hover:text-navy"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.15fr_auto_1.15fr_0.85fr_0.85fr_1.2fr]">
        <AirportField label="Desde" value={from} onChange={setFrom} exclude={to?.code} placeholder="Ciudad o aeropuerto" icon="despegue" />
        <button
          type="button"
          onClick={swap}
          aria-label="Intercambiar origen y destino"
          className="mx-auto -my-2 grid size-10 place-items-center self-end rounded-full bg-white text-navy shadow-card ring-1 ring-line transition hover:rotate-180 hover:text-sky lg:my-0 lg:mb-1.5"
        >
          <svg viewBox="0 0 24 24" className="size-5 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7" />
          </svg>
        </button>
        <AirportField label="Hacia" value={to} onChange={setTo} exclude={from?.code} placeholder="¿A dónde vas?" icon="aterrizaje" />

        <div className="grid grid-cols-2 gap-3 lg:contents">
          <div className="min-w-0">
            <label htmlFor="fs-depart" className="fs-label">
              Ida
            </label>
            <div className="fs-box">
              <input
                id="fs-depart"
                type="date"
                min={today || undefined}
                value={depart}
                                onChange={(e) => {
                  setDepart(e.target.value);
                  if (ret && ret < e.target.value) setRet("");
                }}
                className="fs-input"
              />
            </div>
          </div>
          <div className="min-w-0">
            <label htmlFor="fs-return" className={`fs-label ${trip === "solo-ida" ? "opacity-50" : ""}`}>
              Regreso
            </label>
            <div className={`fs-box ${trip === "solo-ida" ? "opacity-50" : ""}`}>
              <input
                id="fs-return"
                type="date"
                min={depart || today}
                value={trip === "solo-ida" ? "" : ret}
                disabled={trip === "solo-ida"}
                                onChange={(e) => setRet(e.target.value)}
                className="fs-input disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="relative min-w-0" ref={paxRef}>
          <span id="fs-pax-label" className="fs-label">
            Pasajeros y cabina
          </span>
          <button type="button" aria-labelledby="fs-pax-label" aria-expanded={paxOpen} aria-controls="fs-pax" onClick={() => setPaxOpen((o) => !o)} className="fs-box w-full text-left">
            <svg viewBox="0 0 24 24" className="size-5 flex-none text-sky" fill="currentColor" aria-hidden>
              <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" />
            </svg>
            <span className="min-w-0 truncate text-[15px] font-semibold text-navy">
              {travelers} viajero{travelers > 1 ? "s" : ""}, {cabin}
            </span>
          </button>
          {paxOpen && (
            <div id="fs-pax" className="absolute top-full right-0 z-30 mt-2 w-[min(340px,calc(100vw-48px))] rounded-2xl bg-white p-4 shadow-lift ring-1 ring-line">
              <div className="divide-y divide-line">
                <Counter label="Adultos" hint="12 años o más" value={adults} min={1} max={9} onChange={(n) => { setAdults(n); if (babies > n) setBabies(n); }} />
                <Counter label="Niños" hint="De 2 a 11 años" value={kids} min={0} max={8} onChange={setKids} />
                <Counter label="Bebés" hint="Menores de 2 años" value={babies} min={0} max={adults} onChange={setBabies} />
              </div>
              <label htmlFor="fs-cabin" className="mt-3 block text-[13px] font-semibold text-muted">
                Cabina
              </label>
              <select id="fs-cabin" value={cabin} onChange={(e) => setCabin(e.target.value as Cabin)} className="mt-1 w-full rounded-xl bg-bg px-3 py-2.5 font-semibold text-navy">
                <option>Económica</option>
                <option>Premium económica</option>
                <option>Ejecutiva</option>
              </select>
              <button type="button" onClick={() => setPaxOpen(false)} className="btn btn-navy btn-sm mt-4 w-full">
                Listo
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-ink">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={bag} onChange={(e) => setBag(e.target.checked)} className="size-[18px] accent-sky" />
            Incluir maleta de bodega
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={flexible} onChange={(e) => setFlexible(e.target.checked)} className="size-[18px] accent-sky" />
            Fechas flexibles (± 3 días)
          </label>
        </div>
        <button type="submit" className="btn btn-yellow px-8 py-4 text-base">
          <WhatsAppIcon className="size-5" />
          Cotizar vuelo
        </button>
      </div>

      <p className="mt-3 min-h-5 text-sm" aria-live="polite">
        {error ? (
          <span className="font-semibold text-[#C2410C]">{error}</span>
        ) : sent ? (
          <span className="font-semibold text-green">Abrimos WhatsApp con los datos de tu vuelo. Te respondemos con las mejores tarifas.</span>
        ) : (
          <span className="text-muted">Comparamos aerolíneas por ti y te enviamos las mejores tarifas por WhatsApp. Sin costo de cotización.</span>
        )}
      </p>
    </form>
  );
}
