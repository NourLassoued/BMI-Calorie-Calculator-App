import React from 'react'

export default function Footer() {
  return (
   <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>À propos</h3>
                    <ul>
                        <li><a href="#">Qui sommes-nous</a></li>
                        <li><a href="#">Nos magasins</a></li>
                        <li><a href="#">Carrières</a></li>
                        <li><a href="#">Contact</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Service client</h3>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Livraison</a></li>
                        <li><a href="#">Retours</a></li>
                        <li><a href="#">Garantie</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Informations légales</h3>
                    <ul>
                        <li><a href="#">Mentions légales</a></li>
                        <li><a href="#">CGV</a></li>
                        <li><a href="#">Politique de confidentialité</a></li>
                        <li><a href="#">Cookies</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h3>Suivez-nous</h3>
                    <ul>
                        <li><a href="#">📘 Facebook</a></li>
                        <li><a href="#">📷 Instagram</a></li>
                        <li><a href="#">🐦 Twitter</a></li>
                        <li><a href="#">💼 LinkedIn</a></li>
                    </ul>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2024 ShopX. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
  )
}
