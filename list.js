import { sb, isAdmin } from "./_lib.js";

export default async function handler(req, res) {
  if (!isAdmin(req.headers["x-admin"])) return res.status(401).json({ error: "Code incorrect" });
  try {
    const rows = await sb("/rest/v1/submissions?select=id,created_at,nom,postnom,prenom,faculte,fichier,statut&order=created_at.desc");
    res.status(200).json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Erreur serveur" }); }
}
