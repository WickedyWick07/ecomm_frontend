import React, {useState, useEffect, useContext} from "react";
import api from "../../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import '../styles/Cart.css'

const Cart = () => {
    const {token} = useContext(AuthContext)
    const {fetchCart, cart} = useContext(CartContext)
    const [isLoading, setIsLoading] = useState(true)
    const [totalPrice, setTotalPrice] = useState(null)
    const navigate = useNavigate()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    useEffect(() => {
        const fetchCartData = async () => {
            setIsLoading(true)
            try {
                await fetchCart();
                
                await totalPriceCalc();
            } catch (error) {
                console.error("Error fetching cart data", error);
            } finally{
                setIsLoading(false)
            }
        };
        fetchCartData();
    }, [token]);

   const totalPriceCalc = async () => {
        try {
            const totalResponse = await api.get('api/cart/total_price/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTotalPrice(totalResponse.data.total_price);
        } catch (error) {
            console.error("Error calculating total price", error);
        }
    };

    const handleRemoveFromCart = async (itemId) => {
        try {
                await api.delete(`api/cart/remove/${itemId}/`,{
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            } )
            totalPriceCalc()
            fetchCart()
            
        } catch (error) {
            console.error("Error removing item from cart")
            
        }
    }

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            const response = await api.patch(
                `api/cart/update/${itemId}/`,
                {quantity: newQuantity},
                {headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            );
            console.log(response.data)
            totalPriceCalc()
            fetchCart();
        } catch (error) {
            console.error("Error updating quantity", error)
        }
    }

    
    
    const handleBackToHome = () => {
        navigate('/')

    }

    const handleProceedToCheckout = () => {
        navigate("/checkout", {state: {cart: cart}})
    }

    const handleGoToProducts = () => {
        navigate("/products")
    }

    const handleLogout = () => {
        logout()
    }


    if (isLoading) return <div class="loading-overlay">
        <div className='loading-icon'><img src="https://i.gifer.com/1amw.gif" alt="loading" /></div>
        </div>

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }


    return (
        <>
          
            {(!cart || !cart.items || cart.items.length === 0) ?
                <div className="cart__container">
                <h3>There are no items in your cart</h3> 
                <button onClick={handleGoToProducts}>Go to products</button>
                </div> : 
                <div className="cart__container">
                  <h1>Shopping Cart</h1>
                    <div className="cart__dropdown">
                        <button onClick={toggleDropdown} className="dropdown__toggle">
                            <i className="bi bi-list"></i>
                            Menu
                            <span id='arrow' className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></span>
                        </button>
                        {isDropdownOpen && (
                            <div className="dropdown__menu">
                                <button onClick={handleGoToProducts}>Back to products list</button>
                                <button onClick={handleBackToHome}>Back to Home</button>
                                <button onClick={handleLogout}>Log out</button>
                            </div>
                        )}
                    </div>
                    <ul className="cart__list">
                        {cart.items.map(item => (
                            <li key={item.id} className="cart__item">
                                <div className="cart__item-image">
                                    {(item.product.image && <img
                                        alt={item.product.name}
                                        height='200px' width='200px'
                                        src={item.product.image}
                                    />)}
                                </div>
                                <div className="cart__item-details">
                                    <h3>{item.product.name}</h3>
                                    <p>Price: {item.product.price}</p>
                                    <p>Stock Available: {item.product.stock}</p>
                                    <label>
                                        Quantity:
                                        <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e)=>{
                                            handleQuantityChange(
                                                item.id,
                                                parseInt(e.target.value)
                                            )
                                        }}/>
                                    </label>
                                    <button className="cart__remove-button" onClick ={() => handleRemoveFromCart(item.id)}>
                                        <i className="bi bi-eraser"></i>
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {totalPrice && <p className="cart__total">Total Price: ${totalPrice} </p> }
                    <button className="cart__checkout-button" onClick={handleProceedToCheckout}>Proceed to Checkout</button>
                </div>}
            
        </>
    )


}


export default Cart 