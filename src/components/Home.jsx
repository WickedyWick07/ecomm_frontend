import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { CartContext } from "../context/CartContext";
import '../styles/Home.css'
import axios from 'axios'


function Home(){
    const {user, logout} = useContext(AuthContext)
    const{addToCart} = useContext(CartContext)
    const navigate = useNavigate()
    const [featuredProducts, setFeaturedProducts] = useState([])
    const API_URL = import.meta.env.VITE_API_URL
    useEffect(() => {

        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${API_URL}/products/`);
                console.log(response.data)
                setFeaturedProducts(response.data.results)
                
            } catch (error) {
                console.log('error fetching products', error)
                
            }
        }


        fetchProducts()
    },[])

    

    const handleLogout = () => {
        logout()
    }
    return (
        <>
            <div className="home__container"> 
                <div className="header__conatiner">
                    <header>
                        {user ? <h2>Welcome to ecommerce store, {user.username}</h2>: <h2>Welcome to ecommerce store, Guest </h2> }
                        
                        <div className="nav__container">
                            <nav className='nav'>
                                {user ? <ul>
                                    <li>
                                        <a className='nav-link' id="navi-link" href='/products'>Go to Products</a>
                                        <a className='nav-link' id="navi-link" href='/cart'>Go to Cart</a>
                                        <button onClick={handleLogout}> 
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-door-closed-fill" viewBox="0 0 16 16">
                                            <path d="M12 1a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V2a1 1 0 0 1 1-1zm-2 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                                        </svg>
                                            Log out 
                                            </button>

                                    </li>
                                </ul> :  <ul>
                                    <li>
                                        <a className='nav-link' href='/login'>Go to Login</a>
                                        <a className='nav-link' href='/signup'>Go to Signup</a>
                                    </li>
                                </ul> }
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
                        {featuredProducts ? (
                            featuredProducts.map(product => (
                                <div key={product.id} className="product-card">
                                    <img 
                                    src={`http://localhost:8000${product.image}`} 
                                    alt={product.name} 
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover'
                                    }}/>
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
                    </div>
                </section>
            </div>
        </>
    )
}

export default Home 