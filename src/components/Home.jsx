import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import '../styles/Home.css';
import axios from 'axios';

function Home() {
    const { user, logout } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/products/`);
                console.log(response.data);
                setFeaturedProducts(response.data.results);
            } catch (error) {
                console.log('Error fetching products or images', error);
            }
        };

        fetchProducts();
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <div className="home__container">
                <div className="header__conatiner">
                    <header>
                        {user ? <h2>Welcome to ecommerce store, {user.username}</h2> : <h2>Welcome to ecommerce store, Guest</h2>}
                        <div className="nav__container">
                        <nav className="nav">
  {user ? (
    <ul className="nav-list">
      <li className="nav-item">
        <a className="nav-link" href="/products">
          <i className="fas fa-boxes"></i> Products
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/cart">
          <i className="fas fa-shopping-cart"></i> Cart
        </a>
      </li>
      <li className="nav-item">
        <button onClick={handleLogout} className="nav-link logout-button">
          <i className="fas fa-door-closed"></i> Log out
        </button>
      </li>
    </ul>
  ) : (
    <ul className="nav-list">
      <li className="nav-item">
        <a className="nav-link" href="/login">
          <i className="fas fa-sign-in-alt"></i> Login
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/signup">
          <i className="fas fa-user-plus"></i> Signup
        </a>
      </li>
    </ul>
  )}
</nav>


                        </div>
                    </header>
                </div>

                <section className="hero__section">
                    <h1>Discover Amazing Products</h1>
                    <p>Shop the latest trends and best deals on our store</p>
                    <button onClick={() => navigate('/products')}>Shop Now</button>
                </section>

                <section className="featured-categories">
                    <h2>Shop by Category</h2>
                    <div className="category-grid">
                        <div className="category-item">Electronics</div>
                        <div className="category-item">Clothing</div>
                        <div className="category-item">Home & Garden</div>
                        <div className="category-item">Beauty</div>
                    </div>
                </section>

                <section className="products__section">
                    <h2>Featured Products</h2>
                    <div className="product-grid">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <img 
                                        src={product.image}
                                        alt={product.name} 
                                       
                                    />
                                    <h3>{product.name}</h3>
                                    <p>${product.price}</p>
                                </div>
                            ))
                        ) : (
                            <p>Loading featured products...</p>
                        )}
                    </div>
                </section>
                <section className="why-shop-with-us"> 
    <h2>Why Shop With Us</h2> 
    <div className="reasons-grid"> 
        <div className="reason-item"> 
            <i className="fas fa-truck"></i> 
            <h3>Free Shipping</h3> 
            <p>On orders over $50</p> 
        </div> 
        <div className="reason-item"> 
            <i className="fas fa-undo"></i> 
            <h3>Easy Returns</h3> 
            <p>30-day return policy</p> 
        </div> 
        <div className="reason-item"> 
            <i className="fas fa-lock"></i> 
            <h3>Secure Payment</h3> 
            <p>100% secure checkout</p> 
        </div> 
        <div className="reason-item"> 
            <i className="fas fa-headset"></i> 
            <h3>24/7 Support</h3> 
            <p>Round-the-clock assistance</p> 
        </div>
        <div className="reason-item"> 
            <i className="fas fa-tags"></i> 
            <h3>Best Price Guarantee</h3> 
            <p>Lowest prices or price match</p> 
        </div>
        <div className="reason-item"> 
            <i className="fas fa-gift"></i> 
            <h3>Loyalty Rewards</h3> 
            <p>Earn points on every purchase</p> 
        </div>
    </div> 
</section>
            </div>
        </>
    );
}

export default Home;
