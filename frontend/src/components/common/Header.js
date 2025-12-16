import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <div className="container">
        <nav>
          <a href="#" className="logo">
            💪 FitLife
          </a>

          <ul className="nav-links">
            <li>
              <a href="#home">Accueil</a>
            </li>
            <li>
              <a href="#programs">Programmes</a>
            </li>
            <li>
              <a href="#coaches">Coachs</a>
            </li>
            <li>
              <a href="#nutrition">Nutrition</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          <div className="nav-actions">
            {/* Icône des séances (ex : favoris / planning) */}
            <div className="workout-icon">
              🏋️
              <span className="badge">5</span>
            </div>

            {/* Bouton vers login */}
            <Link to="/login" className="btne btne-primary">
              Connexion
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
