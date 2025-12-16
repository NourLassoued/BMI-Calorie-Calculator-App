import React from 'react'

export default function ProductCard() {
  return (
    <>
      <section id="products" className="container">
        <h2 className="section-title">🔥 Produits Populaires</h2>

        <div className="product-grid">

          <div className="product-card">
            <div className="product-image">
              <img 
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" 
                alt="T-shirt"
              />
              <span className="badge badge-new">NOUVEAU</span>
              <span className="badge badge-promo">-20%</span>
            </div>

            <div className="product-info">
              <h3 className="product-title">T-shirt Premium</h3>
              <p className="product-description">
                T-shirt en coton bio de haute qualité, confortable et durable
              </p>

              <div className="product-price">
                <span className="price-current">20€</span>
                <span className="price-old">25€</span>
              </div>

              <div className="product-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span>(4.8)</span>
                <span>127 avis</span>
              </div>

              <div className="product-actions">
                <button className="btn btn-primary btn-cart">🛒 Ajouter au panier</button>
                <button className="btn-wishlist">❤️</button>
              </div>
            </div>
          </div>


     
          <div className="product-card">
            <div className="product-image">
              <img 
                src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" 
                alt="Chaussures"
              />
              <span className="badge badge-promo">-30%</span>
            </div>

            <div className="product-info">
              <h3 className="product-title">Sneakers Sport</h3>
              <p className="product-description">
                Chaussures de sport confortables pour toutes vos activités
              </p>

              <div className="product-price">
                <span className="price-current">70€</span>
                <span className="price-old">100€</span>
              </div>

              <div className="product-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span>(4.9)</span>
                <span>234 avis</span>
              </div>

              <div className="product-actions">
                <button className="btn btn-primary btn-cart">🛒 Ajouter au panier</button>
                <button className="btn-wishlist">❤️</button>
              </div>
            </div>
          </div>


          
          <div className="product-card">
            <div className="product-image">
              <img 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" 
                alt="Sac"
              />
              <span className="badge badge-new">NOUVEAU</span>
            </div>

            <div className="product-info">
              <h3 className="product-title">Sac à dos Design</h3>
              <p className="product-description">
                Sac à dos moderne avec compartiments pour ordinateur portable
              </p>

              <div className="product-price">
                <span className="price-current">45€</span>
              </div>

              <div className="product-rating">
                <span className="stars">⭐⭐⭐⭐</span>
                <span>(4.6)</span>
                <span>89 avis</span>
              </div>

              <div className="product-actions">
                <button className="btn btn-primary btn-cart">🛒 Ajouter au panier</button>
                <button className="btn-wishlist">❤️</button>
              </div>
            </div>
          </div>


        
          <div className="product-card">
            <div className="product-image">
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" 
                alt="Montre"
              />
              <span className="badge badge-promo">-15%</span>
            </div>

            <div className="product-info">
              <h3 className="product-title">Montre Élégante</h3>
              <p className="product-description">
                Montre classique avec bracelet en cuir véritable
              </p>

              <div className="product-price">
                <span className="price-current">85€</span>
                <span className="price-old">100€</span>
              </div>

              <div className="product-rating">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span>(4.7)</span>
                <span>156 avis</span>
              </div>

              <div className="product-actions">
                <button className="btn btn-primary btn-cart">🛒 Ajouter au panier</button>
                <button className="btn-wishlist">❤️</button>
              </div>
            </div>
          </div>

        </div> 

      </section>
    </>
  )
}
