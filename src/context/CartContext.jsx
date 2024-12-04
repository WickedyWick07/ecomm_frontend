import React, { createContext, useState, useContext , useEffect} from "react";
import api from "../../services/api";
import { AuthContext } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children}) => {
    const [cart, setCart] = useState(null);
    const { token } = useContext(AuthContext)
    

    useEffect(() => {


        if (token) {
            fetchCart();
        }
    }, [token]);

    const fetchCart = async () => {
        try {
            const response = await api.get('api/cart/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart', error);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        try {
            const response = await api.post(
                'api/cart/add/', 
                {product_id: productId, quantity},
                {headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
            )
            setCart(response.data)
        } catch (error) {
            console.error("Error adding to the cart", error)
            
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await api.delete(`api/cart/remove/${itemId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setCart((prev) => ({
                ...prevCart,
                items: prevCart.items.filter((item) => item.id !== itemId), 
            }))
        } catch (error) {
            console.error("Error removing from cart", error)
        }
        
    };

    return(
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, fetchCart}}>
            {children}
        </CartContext.Provider>
    )
}

export {CartContext}

