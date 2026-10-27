import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wrap grid min-h-[50vh] place-items-center py-20 text-center">
      <div>
        <p className="text-xs font-bold tracking-[0.24em] text-sky">ERROR 404</p>
        <h1 className="mt-2 text-4xl font-extrabold text-navy">
          Este destino <span className="text-yellow">no existe</span>
        </h1>
        <p className="mt-3 text-muted">Puede que el plan ya haya terminado. Mira nuestras promociones vigentes.</p>
        <Link href="/#promociones" className="btn btn-yellow mt-6">Ver promociones</Link>
      </div>
    </main>
  );
}
