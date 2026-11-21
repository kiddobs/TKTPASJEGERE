import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
const e = (k) => process.env[k];

export function isAdmin(pw) { return !!pw && pw === e("ADMIN_PASSWORD"); }

export async function sb(path, opts = {}) {
  const key = e("SUPABASE_SERVICE_KEY");
  const r = await fetch(e("SUPABASE_URL") + path, {
    ...opts,
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/json", ...(opts.headers || {}) },
  });
  if (!r.ok) throw new Error("Supabase " + r.status + " " + (await r.text()));
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

export async function upload(path, buf) {
  const key = e("SUPABASE_SERVICE_KEY");
  const r = await fetch(e("SUPABASE_URL") + "/storage/v1/object/pdfs/" + path, {
    method: "POST",
    headers: { apikey: key, Authorization: "Bearer " + key, "Content-Type": "application/pdf", "x-upsert": "true" },
    body: buf,
  });
  if (!r.ok) throw new Error("Storage " + r.status + " " + (await r.text()));
  return e("SUPABASE_URL") + "/storage/v1/object/public/pdfs/" + path;
}

export async function twilio(to, body, { whatsapp = true, mediaUrl } = {}) {
  const sid = e("TWILIO_ACCOUNT_SID");
  const from = whatsapp ? e("TWILIO_WHATSAPP_FROM") : e("TWILIO_SMS_FROM");
  const clean = to.replace(/\s+/g, "");
  const p = new URLSearchParams({ From: from, To: (whatsapp ? "whatsapp:" : "") + clean, Body: body });
  if (mediaUrl) p.set("MediaUrl", mediaUrl);
  const r = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: { Authorization: "Basic " + Buffer.from(sid + ":" + e("TWILIO_AUTH_TOKEN")).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
    body: p,
  });
  if (!r.ok) throw new Error("Twilio " + r.status + " " + (await r.text()));
}

export async function mail(to, subject, html, attachment) {
  const body = { from: e("RESEND_FROM"), to: [to], subject, html };
  if (attachment) body.attachments = [attachment];
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + e("RESEND_API_KEY"), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error("Resend " + r.status + " " + (await r.text()));
}

// Résout le PDF avec Claude. Le numéro de téléphone n'est jamais envoyé.
export async function solve(pdfBase64, who) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": e("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-5-5",
      max_tokens: 8000,
      messages: [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
          { type: "text", text: "Ce document contient un TP ou des exercices (cours quelconque). Résous-le entièrement, en français, question par question, avec les étapes de calcul ou de raisonnement. Écris en texte simple (pas de LaTeX, pas de markdown). Commence par : Étudiant : " + who + "." },
        ],
      }],
    }),
  });
  if (!r.ok) throw new Error("Claude " + r.status + " " + (await r.text()));
  const j = await r.json();
  return j.content.filter((c) => c.type === "text").map((c) => c.text).join("\n");
}

export async function textToPdf(text) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const size = 11, lh = 15, m = 50, W = 595, H = 842;
  const clean = text.replace(/\*\*/g, "").replace(/[^\x09\x0A\x20-\x7E\xA0-\xFF]/g, "?");
  let page = doc.addPage([W, H]), y = H - m;
  for (const para of clean.split("\n")) {
    let line = "";
    const flush = () => {
      if (y < m) { page = doc.addPage([W, H]); y = H - m; }
      page.drawText(line, { x: m, y, size, font, color: rgb(0.1, 0.1, 0.1) });
      y -= lh; line = "";
    };
    for (const w of para.split(" ")) {
      const t = line ? line + " " + w : w;
      if (font.widthOfTextAtSize(t, size) > W - 2 * m) { flush(); line = w; } else line = t;
    }
    flush();
  }
  return Buffer.from(await doc.save());
}
