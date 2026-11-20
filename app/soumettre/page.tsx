'use client';

import { useRef, useState } from 'react';

export default function Soumettre() {
  const [step, setStep] = useState(1);
  const [identity, setIdentity] = useState({ nom: '', postNom: '', prenom: '', faculte: '', telephone: '' });
  const [status, setStatus] = useState('');
  const subjectRef = useRef<HTMLInputElement>(null);
  const courseRef = useRef<HTMLInputElement>(null);

  async function generate() {
    setStatus('Préparation du document…');
    setStep(3);
  }

  return (
    <main className="form-shell">
      <a className="back" href="/">← Accueil</a>
      <section className="form-card">
        <header>
          <p className="eyebrow">NOUVELLE DEMANDE</p>
          <h2>{step === 1 ? 'Tes informations' : step === 2 ? 'Tes fichiers' : 'Résultat'}</h2>
          <div className="progress"><span style={{ width: `${step * 33.333}%` }} /></div>
        </header>

        {step === 1 && (
          <div className="form-grid">
            {(['nom', 'postNom', 'prenom', 'faculte', 'telephone'] as const).map((field) => (
              <label key={field}>
                {field === 'postNom' ? 'Post-nom' : field === 'telephone' ? 'Numéro de téléphone' : field[0].toUpperCase() + field.slice(1)}
                <input value={identity[field]} onChange={(e) => setIdentity({ ...identity, [field]: e.target.value })} required />
              </label>
            ))}
            <button className="primary full" onClick={() => setStep(2)}>Continuer →</button>
          </div>
        )}

        {step === 2 && (
          <div className="form-grid">
            <label>Sujet ou exercice en PDF<input ref={subjectRef} type="file" accept="application/pdf" /></label>
            <label>Cours ou ressources PDF<input ref={courseRef} type="file" accept="application/pdf" multiple /></label>
            <button className="primary full" onClick={generate}>Générer la résolution →</button>
          </div>
        )}

        {step === 3 && (
          <div className="result">
            <div className="check">✓</div>
            <h3>Document préparé</h3>
            <p>{status || 'La génération peut être lancée par l’administrateur.'}</p>
            <a className="primary" href="/soumettre">Nouvelle demande</a>
          </div>
        )}
      </section>
    </main>
  );
}
