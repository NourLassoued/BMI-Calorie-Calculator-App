import React from 'react'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <h1>Bienvenue sur FitLife 💪</h1>
        <p>
          Atteignez vos objectifs grâce à nos programmes d’entraînement personnalisés,
          nutrition et coaching en ligne.
        </p>

        <a
          href="#programs"
          className="btne btne-primary"
          style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}
        >
          Voir les programmes
        </a>
      </div>
    </section>
  );
}
