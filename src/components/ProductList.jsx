import React, { useState, useEffect, useContext, useCallback } from 'react';
import api from '../../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import '../styles/ProductList.css';
import debounce from 'lodash.debounce';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [prevPage, setPrevPage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const { token, user, logout } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const { addToCart, cart, fetchCart } = useContext(CartContext);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const fetchProducts = async () => {
        setLoading(true);
        setIsSearching(false);
        try {
            const response = await api.get(`${import.meta.env.VITE_API_URL}/api/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Response data:', response.data);
            setProducts(response.data.results);
            setNextPage(response.data.links.next);
            setPrevPage(response.data.links.previous);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (!token) {
            console.log('There is no token or user set.');
            const storedToken = localStorage.getItem("token");
            setToken(storedToken);
        } else {
            fetchProducts();
        }
    }, []);

    useEffect(() => {
        if (cart && cart.items) {
            setCartItemCount(cart.items.length);
        }
    }, [cart]);

    const handleAddClick = (productId) => {
        addToCart(productId);
        fetchCart()
    };

    const handleNextPage = () => {
        if (nextPage) {
            setSearchQuery("");
            setIsSearching(false);
            fetchProducts(nextPage);
        }
    };

    const filterProducts = async (query) => {
        setIsSearching(true);
        setLoading(true);
        try {
            const response = await api.get(`products?search=${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setProducts(response.data.results);
            setNextPage(response.data.links.next);
            setPrevPage(response.data.links.previous);
        } catch (error) {
            console.error('Error searching products:', error);
        }
        setLoading(false);
    };

    const debouncedFilterProducts = useCallback(debounce(filterProducts, 800), []);

    const handlePrevPage = () => {
        if (prevPage) {
            setSearchQuery('');
            setIsSearching(false);
            fetchProducts(prevPage);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 0) {
            debouncedFilterProducts(query);
        } else {
            setIsSearching(false);
            fetchProducts(API_URL);
        }
    };

    const handleViewProduct = (product) => {
        navigate(`/products/${product.id}/`, { state: { product } });
    };

    const handleGoToCart = () => {
        navigate('/cart');
    };

    const handleGoToHome = () => {
        navigate('/');
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <div className='productlist__container'>
            <h1>Products</h1>

            <div className="cart-icon-container">
                <div className="cart-icon">
                    <i className="bi bi-cart"></i>
                    <span>{cartItemCount}</span>
                </div>
            </div>

            <div className="header__container">
                <div className="dropdown">
                    <button className="dropbtn">
                    <i class="bi bi-list"></i>
                        Menu                            
                        </button>
                    <div className="dropdown-content">
                        <button className='nav-buttons' onClick={handleGoToCart}>
                            Go to cart
                        </button>
                        <button className='nav-buttons' onClick={handleGoToHome}>
                            <i className='bi bi-house'></i>
                            Home
                        </button>
                        <button className='nav-buttons' onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </div>

                <div className="search__icon">
                <input type="text"
                    className='search-query'
                    placeholder='search products'
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>
            </div>

           

            <div className="products__container">
                <ul>
                    {products.map(product => (
                        <li key={product.id}>
                            <h2>{product.name}</h2>
                            {product.image && (
                                <img
                                src={`https://ecomm-backend-ccrd.onrender.com/${product.image}`}
                                alt={product.name}
                                />
                            )}
                            <p>{product.description}</p>
                            <p>Price: ${product.price}</p>
                            <p>Category: {product.category}</p>
                            <p>Stock: {product.stock}</p>
                            <div className="buttons__container">
                                <button onClick={() => handleAddClick(product.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0"/>
                                    </svg> Add To Cart
                                </button>
                                <button onClick={() => handleViewProduct(product)}>
                                    View Product
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                {prevPage && <button className='nav-buttons' onClick={handlePrevPage}>
                    <i className="bi-arrow-bar-left"></i>
                    Previous
                </button>}
                {nextPage && <button className='nav-buttons' onClick={handleNextPage}>
                    <i className="bi-arrow-bar-right"></i>
                    Next
                </button>}
            </div>
        </div>
    );
};

export default ProductList;
