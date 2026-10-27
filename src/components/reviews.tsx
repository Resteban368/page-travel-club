import { getReviews } from "@/lib/api";
import { formatDate } from "@/lib/format";

const avatarColors = ["bg-sky", "bg-green", "bg-yellow", "bg-blue"];

export async function ReviewList() {
  const reviews = await getReviews();

  if (!reviews.length) {
    return (
      <p className="col-span-full rounded-[22px] bg-white p-[30px] text-center text-muted">
        Aún no hay opiniones. ¡Sé el primero en contarnos tu experiencia!
      </p>
    );
  }

  return reviews.slice(0, 30).map((r, i) => {
    const n = Math.max(1, Math.min(5, Math.round(r.stars) || 5));
    return (
      <figure key={r.id} className="flex flex-col gap-3.5 rounded-[22px] bg-white p-[26px] shadow-card">
        <div className="text-xl tracking-[3px] text-yellow" aria-label={`${n} de 5 estrellas`}>
          {"★".repeat(n)}
          <span className="text-[#D7DEEA]">{"★".repeat(5 - n)}</span>
        </div>
        <blockquote className="flex-1 text-base">{r.text}</blockquote>
        <figcaption className="flex items-center gap-3 text-[13px] text-muted">
          <span className={`grid size-11 flex-none place-items-center rounded-full font-extrabold text-white ${avatarColors[i % 4]}`} aria-hidden>
            {r.name.trim()[0]?.toUpperCase() ?? "?"}
          </span>
          <div>
            <b className="block text-[15px] text-navy">{r.name}</b>
            {r.plan}
          </div>
          <time dateTime={r.createdAt} className="ml-auto text-xs">{formatDate(r.createdAt)}</time>
        </figcaption>
      </figure>
    );
  });
}
