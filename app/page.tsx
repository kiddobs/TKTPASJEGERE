import Link from 'next/link';

export default function Home() {
  return (
    <main className="shell">
      <nav className="nav">
        <div className="brand"><span>TK</span>TPASJEGERE</div>
        <div className="nav-links">
          <Link href="/soumettre">Nouvelle demande</Link>
          <Link href="/admin">Administration</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">ASSISTANCE INTELLIGENTE</p>
          <h1>Ton TP devient<br /><em>un document fini.</em></h1>
          <p className="subtitle">Importe ton sujet, ton cours et tes informations. TKTPASJEGERE prépare une résolution structurée automatiquement.</p>
          <div className="actions">
            <Link className="primary" href="/soumettre">Commencer maintenant <b>→</b></Link>
            <button className="language" type="button">FR · EN · LN</button>
          </div>
        </div>

        <div className="orbital" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="core"><div>TP</div></div>
          <div className="chip chip-a">PDF</div>
          <div className="chip chip-b">IA</div>
          <div className="chip chip-c">3D</div>
        </div>
      </section>

      <section className="steps">
        <article><b>01</b><h3>Identité</h3><p>Nom, faculté et téléphone.</p></article>
        <article><b>02</b><h3>Fichiers</h3><p>Exercice, cours et consignes.</p></article>
        <article><b>03</b><h3>Résultat</h3><p>Résolution prête à télécharger.</p></article>
      </section>
    </main>
  );
}
