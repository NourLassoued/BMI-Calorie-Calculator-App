import React from 'react'

export default function CATEGORIES() {
  return (
    <>

      {/* Catégories */}
      <section
        id="categories"
        style={{ background: "white", padding: "3rem 0" }}
      >
        <div className="container">
          <h2 className="section-title">📂 Catégories</h2>

          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">👕</div>
              <div className="category-name">Mode</div>
            </div>

            <div className="category-card">
              <div className="category-icon">💻</div>
              <div className="category-name">Électronique</div>
            </div>

            <div className="category-card">
              <div className="category-icon">🏠</div>
              <div className="category-name">Maison</div>
            </div>

            <div className="category-card">
              <div className="category-icon">⚽</div>
              <div className="category-name">Sport</div>
            </div>

            <div className="category-card">
              <div className="category-icon">📚</div>
              <div className="category-name">Livres</div>
            </div>

            <div className="category-card">
              <div className="category-icon">🎮</div>
              <div className="category-name">Jeux</div>
            </div>
          </div>
        </div>
      </section>

      {/* Panier */}
      <section
        className="container"
        id="cart-page"
        style={{ display: "none" }}
      >
        <h2 className="section-title">🛒 Mon Panier</h2>

        <div className="cart-container">
          <div className="cart-items">

            {/* ITEM 1 */}
            <div className="cart-item">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100"
                alt="Product"
                className="cart-item-image"
              />

              <div className="cart-item-details">
                <div className="cart-item-title">T-shirt Premium</div>
                <div className="cart-item-variant">Taille: M | Couleur: Rouge</div>
                <div className="cart-item-price">20€</div>
              </div>

              <div className="quantity-controls">
                <button>-</button>
                <span>2</span>
                <button>+</button>
              </div>

              <div>
                <strong>40€</strong>
              </div>

              <div className="cart-item-remove">🗑️</div>
            </div>

            {/* ITEM 2 */}
            <div className="cart-item">
              <img
                src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=100"
                alt="Product"
                className="cart-item-image"
              />

              <div className="cart-item-details">
                <div className="cart-item-title">Sneakers Sport</div>
                <div className="cart-item-variant">Taille: 42 | Couleur: Blanc</div>
                <div className="cart-item-price">70€</div>
              </div>

              <div className="quantity-controls">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>

              <div>
                <strong>70€</strong>
              </div>

              <div className="cart-item-remove">🗑️</div>
            </div>

          </div>

          {/* Résumé */}
          <div className="cart-summary">
            <h3 style={{ marginBottom: "1.5rem" }}>Résumé de la commande</h3>

            <div className="summary-row">
              <span>Sous-total</span>
              <span>110€</span>
            </div>

            <div className="summary-row">
              <span>Livraison</span>
              <span>5€</span>
            </div>

            <div className="summary-row">
              <span>TVA</span>
              <span>23€</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>138€</span>
            </div>

            <button
              className="btn btn-primary"
              style={{
                width: "100%",
                padding: "1rem",
                fontSize: "1.1rem",
                marginTop: "1rem"
              }}
            >
              Passer la commande
            </button>

            <a
              href="#products"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1rem",
                color: "#2563eb",
                textDecoration: "none"
              }}
            >
              Continuer mes achats
            </a>
          </div>
        </div>
      </section>

    </>
  );
}
