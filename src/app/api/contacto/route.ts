import { services } from "@/content/services";
import { normalizeContact, OTHER_SERVICE, validateContact } from "@/lib/contactForm";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort, per server instance; serverless deployments need a shared store for strict limits.
const recentByIp = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const hits = (recentByIp.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recentByIp.set(ip, hits);
  return hits.length > MAX_PER_WINDOW;
}

const json = (body: object, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json({ error: "invalid_request" }, 400);
  }
  if (!raw || typeof raw !== "object") return json({ error: "invalid_request" }, 400);

  const data = normalizeContact(raw as Record<string, unknown>);

  // Bots fill the hidden field; accept without delivering so they get no signal.
  if (data.website) return json({ ok: true }, 200);

  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) return json({ error: "validation", errors }, 422);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return json({ error: "rate_limited" }, 429);

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.warn("[contacto] Envío no configurado: faltan RESEND_API_KEY, CONTACT_TO_EMAIL o CONTACT_FROM_EMAIL.");
    return json({ error: "not_configured" }, 503);
  }

  const serviceName =
    data.service === OTHER_SERVICE ? "Otro / por definir" : services.find((s) => s.id === data.service)?.name ?? "Sin especificar";

  const text = [
    `Nombre: ${data.name}`,
    `Empresa: ${data.company || "—"}`,
    `Correo: ${data.email}`,
    `Teléfono: ${data.phone || "—"}`,
    `Servicio de interés: ${serviceName}`,
    "",
    data.message,
  ].join("\n");

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(data.submissionId ? { "Idempotency-Key": `contacto-${data.submissionId}` } : {}),
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `Solicitud web: ${serviceName} — ${data.name}`,
        text,
      }),
    });

    if (!response.ok) {
      console.error("[contacto] El proveedor rechazó el envío:", response.status, await response.text().catch(() => ""));
      return json({ error: "delivery_failed" }, 502);
    }
    return json({ ok: true }, 200);
  } catch (error) {
    console.error("[contacto] No se pudo contactar al proveedor de correo:", error);
    return json({ error: "delivery_failed" }, 502);
  }
}
