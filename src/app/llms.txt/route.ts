import { getCategories, getCompany, getFaqs, getPlans } from "@/lib/api";
import { formatCOP } from "@/lib/format";
import { site } from "@/lib/site";

// /llms.txt: resumen en Markdown pensado para modelos de IA (https://llmstxt.org).
export async function GET() {
  const [plans, c, faqs] = await Promise.all([getPlans(), getCompany(), getFaqs()]);
  const hours = site.hours.map((h) => `${h.label}: ${h.value}`).join("; ");

  const body = `# ${c.legalName}

> ${site.description}

${c.about}

- Ubicación: ${c.street}, ${c.city}, ${c.region}, Colombia
- Registro Nacional de Turismo (RNT): ${c.rnt}
- WhatsApp y teléfono: ${c.phoneDisplay} (${c.phone})
- Correo: ${c.email}
- Horario presencial: ${hours}${c.virtualHours ? `\n- Atención virtual: ${c.virtualHours}` : ""}
- Gerente general: ${c.managerName}
${c.socials.map((s) => `- ${s.name}: ${s.url}`).join("\n")}

## Misión

${c.mission}

## Visión

${c.vision}

## Planes vigentes

${
  plans.length
    ? plans
        .map(
          (p) =>
            `- [${p.title}](${site.url}/planes/${p.slug}): ${p.summary} ${p.durationLabel}. Fechas: ${p.datesLabel}. Precio: ${p.prices
              .map((x) => `${formatCOP(x.price)} por ${x.unit}${x.label.startsWith("Por ") ? "" : ` (${x.label.toLowerCase()})`}`)
              .join(", ")}.${p.includes.length ? ` Incluye: ${p.includes.join(", ")}.` : ""}`,
        )
        .join("\n")
    : `Consultar próximas salidas por WhatsApp al ${c.phoneDisplay}.`
}

## Tipos de viaje

${getCategories()
  .map((cat) => `- [${cat.title}](${site.url}/viajes/${cat.slug}): ${cat.description}`)
  .join("\n")}

## Cómo reservar

1. Escribir por WhatsApp al ${c.phoneDisplay} con el plan y la fecha.
2. Enviar nombre completo, número de documento y celular de cada viajero.
3. Pagar por transferencia o en efectivo, enviar el comprobante y recibir la factura.

## Políticas

Condiciones completas: ${site.url}/politicas

${c.policies.map((p) => `- ${p.title}`).join("\n")}

## Preguntas frecuentes

${faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`;

  return new Response(body, { headers: { "content-type": "text/markdown; charset=utf-8" } });
}
