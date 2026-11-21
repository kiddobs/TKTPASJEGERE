import { sb, upload, mail } from "./_lib.js";
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { nom, postnom, prenom, fac, tel, fileName, fileBase64 } = req.body || {};
    if (![nom, postnom, prenom, fac, tel, fileName, fileBase64].every(Boolean)) return res.status(400).json({ error: "Champs manquants" });
    const buf = Buffer.from(fileBase64, "base64");
    if (buf.slice(0, 4).toString() !== "%PDF") return res.status(400).json({ error: "Ce n'est pas un PDF" });
    const id = crypto.randomUUID();
    const url = await upload("source/" + id + ".pdf", buf);
    await sb("/rest/v1/submissions", {
      method: "POST",
      body: JSON.stringify({ id, nom, postnom, prenom, faculte: fac, telephone: tel, fichier: fileName, source_url: url }),
    });
    const link = process.env.SITE_URL + "/#parametres";
    await mail(process.env.OWNER_EMAIL, "Nouveau dépôt : " + nom + " " + prenom,
      `<p><b>${nom} ${postnom} ${prenom}</b> (${fac}) a déposé <i>${fileName}</i>.</p><p><a href="${link}">Cliquer ici pour confirmer</a> (espace propriétaire).</p>`);
    res.status(200).json({ ok: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Erreur serveur" }); }
}
