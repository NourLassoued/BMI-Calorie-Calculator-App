import React from 'react'

export default function Footer() {
  return (
    <footer>
        <div className="container">
            <div className="footer-content">
                {/* Section FitLife */}
                <div className="footer-section">
                    <h3>FitLife 💪</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Votre partenaire fitness pour transformer votre corps et votre esprit, où que vous soyez.
                    </p>
                    <ul>
                        <li><a href="#about">Notre mission</a></li>
                        <li><a href="#coaches">Nos coachs experts</a></li>
                        <li><a href="#success">Histoires de succès</a></li>
                    </ul>
                </div>
                
                {/* Section Support */}
                <div className="footer-section">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">Centre d'aide</a></li>
                        <li><a href="#">Guide de démarrage</a></li>
                        <li><a href="#">Abonnements</a></li>
                        <li><a href="#contact">Contactez-nous</a></li>
                    </ul>
                </div>
                
                {/* Section Juridique */}
                <div className="footer-section">
                    <h3>Légal</h3>
                    <ul>
                        <li><a href="#">Conditions d'utilisation</a></li>
                        <li><a href="#">Politique de confidentialité</a></li>
                        <li><a href="#">Gestion des données</a></li>
                        <li><a href="#">Mentions légales</a></li>
                    </ul>
                </div>
                
                {/* Section Réseaux Sociaux */}
                <div className="footer-section">
                    <h3>Rejoignez la communauté</h3>
                    <ul>
                        <li><a href="#">📸 Instagram</a></li>
                        <li><a href="#">🎥 YouTube</a></li>
                        <li><a href="#">👥 Groupe Facebook</a></li>
                        <li><a href="#">🎵 TikTok</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; 2025 FitLife. Conçu pour les athlètes. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
  )
}