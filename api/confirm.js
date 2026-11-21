import { sb, upload, twilio, mail, solve, textToPdf, isAdmin } from "./_lib.js";
export const config = { maxDuration: 300 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { id, password } = req.body || {};
  if (!isAdmin(password)) return res.status(401).json({ error: "Code incorrect" });
  try {
    const [row] = await sb("/rest/v1/submissions?id=eq." + encodeURIComponent(id));
    if (!row) return res.status(404).json({ error: "Introuvable" });
    if (row.statut === "confirmé") return res.status(200).json({ ok: true, deja: true });

    const src = Buffer.from(await (await fetch(row.source_url)).arrayBuffer());
    const who = row.nom + " " + row.postnom + " " + row.prenom + " (" + row.faculte + ")";
    const text = await solve(src.toString("base64"), who); // sans numéro de téléphone
    const pdf = await textToPdf(text);
    const outUrl = await upload("resolu/" + row.id + ".pdf", pdf);

    await sb("/rest/v1/submissions?id=eq." + row.id, { method: "PATCH", body: JSON.stringify({ statut: "confirmé", solution_url: outUrl }) });

    const name = row.nom + " " + row.prenom;
    // 1) Propriétaire : email + WhatsApp, avec le fichier
    await mail(process.env.OWNER_EMAIL, "Confirmé : " + name, `<p>Le PDF de <b>${name}</b> est prêt (en pièce jointe).</p>`,
      { filename: "resolution-" + row.nom + ".pdf", content: pdf.toString("base64") });
    await twilio(process.env.OWNER_WHATSAPP, "Confirmation : le PDF de " + name + " est prêt.", { mediaUrl: outUrl });
    // 2) Photocopieur : WhatsApp uniquement (jamais par email)
    await twilio(process.env.PRINTER_WHATSAPP, "J'ARRIVE RÉCUPÉRER CES DOCUMENTS", { mediaUrl: outUrl });
    // 3) Étudiant : message clair, sans fichier
    await twilio(row.telephone, "Bonjour " + row.prenom + ", ton PDF est bien pris en charge. Il sera imprimé et remis chez le CP. Merci de ta patience.", { whatsapp: false });

    res.status(200).json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Erreur : " + err.message }); }
}
