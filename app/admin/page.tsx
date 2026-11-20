export default function Admin() {
  return (
    <main className="form-shell">
      <a className="back" href="/">← Accueil</a>
      <section className="form-card">
        <p className="eyebrow">ESPACE ADMIN</p>
        <h2>Demandes reçues</h2>
        <div className="empty">Aucune demande pour le moment.</div>
      </section>
    </main>
  );
}
