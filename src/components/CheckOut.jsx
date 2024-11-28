import React, { useState, useEffect, useContext, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/CheckOut.css';
import api from "../../services/api";
import { Fireworks } from 'fireworks-js';

function PaymentModal({ onClose, onSubmit, total }) {
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const validateCardDetails = (cardDetails) => {
        const errors = {};

        if (cardDetails.cardNumber.replace(/\s/g, '').length < 13 || 
            cardDetails.cardNumber.replace(/\s/g, '').length > 19) {
            errors.cardNumber = "Invalid card number length";
        }

        if (!/^\d{3,4}$/.test(cardDetails.cvv)) {
            errors.cvv = "CVV should be 3 or 4 digits";
        }

        const [month, year] = cardDetails.expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;

        if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate) ||
            parseInt(month) < 1 || parseInt(month) > 12 ||
            (parseInt(year) < currentYear || 
             (parseInt(year) === currentYear && parseInt(month) < currentMonth))) {
            errors.expiryDate = "Invalid expiry date";
        }

        return errors;
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
        }
        return v;
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === 'cardNumber') {
            value = formatCardNumber(value);
        } else if (name === 'expiryDate') {
            value = formatExpiryDate(value);
        }
        setCardDetails({ ...cardDetails, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = validateCardDetails(cardDetails);
        if (Object.keys(errors).length === 0) {
            onSubmit(cardDetails);
        } else {
            console.log(errors);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                width: '300px',
                maxWidth: '90%'
            }}>
                <h2 style={{ marginTop: 0, color: '#333' }}>Enter Card Details</h2>
                <p style={{ marginBottom: '20px' }}>Total Amount: ${total}</p>
                <form onSubmit={handleSubmit} style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={cardDetails.cardNumber}
                        onChange={handleChange}
                        required
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                    />
                    <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={cardDetails.expiryDate}
                        onChange={handleChange}
                        required
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                    />
                    <input
                        type="text"
                        name="cvv"
                        maxLength={3}
                        placeholder="CCV"
                        value={cardDetails.cvv}
                        onChange={handleChange}
                        required
                        style={{
                            marginBottom: '10px',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '16px'
                        }}
                    />
                    <button type="submit" style={{
                        padding: '10px 20px',
                        fontSize: '1em',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '10px',
                        backgroundColor: 'green',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>Process Payment</button>
                </form>
                <button onClick={onClose} style={{
                    marginBottom: '10px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: 'bold'
                }}>Close</button>
            </div>
        </div>
    );
}

function Checkout() {
    const { token } = useContext(AuthContext);
    const { cart, fetchCart } = useContext(CartContext);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentComplete, setPaymentComplete] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const fireworksRef = useRef(null);

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (paymentComplete && fireworksRef.current) {
            const fireworks = new Fireworks(fireworksRef.current, {
                speed: 3,
                acceleration: 1.05,
                friction: 0.97,
                gravity: 1.5,
                particles: 50,
                trace: 3,
                explosion: 5,
                boundaries: {
                    top: 50,
                    bottom: fireworksRef.current.clientHeight,
                    left: 50,
                    right: fireworksRef.current.clientWidth
                },
                sound: {
                    enable: true,
                    files: [
                        'https://fireworks.js.org/sounds/explosion0.mp3',
                        'https://fireworks.js.org/sounds/explosion1.mp3',
                        'https://fireworks.js.org/sounds/explosion2.mp3'
                    ],
                    volume: {
                        min: 4,
                        max: 8
                    }
                }
            });

            fireworks.start();

            return () => fireworks.stop();
        }
    }, [paymentComplete]);

    const handlePaymentClick = () => {
        setShowModal(true);
    }

    const handleModalClose = () => {
        setShowModal(false);
    }

    const processPayment = async (cardDetails) => {
        setIsProcessing(true);
        setShowModal(false);
        setError('');
        try {
            const response = await api.post('process-payment/', {
                payment_method: 'card',
                cardDetails,
                amount: calculateTotal()
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.data.message === 'Payment processed successfully') {
                setPaymentComplete(true);
            } else {
                setError(response.data.error || 'Payment processing failed. Please try again.');
            }
        } catch (error) {
            console.error('Error processing payment', error);
            setError(error.response?.data?.error || "An error occurred while processing your payment. Please try again");
        }
        setIsProcessing(false);
        setShowModal(false);
    }

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2);
    };

    if (paymentComplete) {
        return (
            <div ref={fireworksRef} style={{
                position: 'fixed',         /* Fixes the element relative to the viewport */
                top: '50%',                /* Centers vertically */
                left: '50%',               /* Centers horizontally */
                transform: 'translate(-50%, -50%)', /* Adjusts to the exact center */
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                width: '100%',            /* Ensures it fills the screen */
                backgroundColor: '#f8f9fa',
                padding: '20px',
                textAlign: 'center',
                overflow: 'hidden'         /* Hides any scrollbar */
            }}>
                <h2 style={{
                    color: '#28a745',
                    marginBottom: '20px'
                }}>Congratulations!</h2>
                <p style={{
                    fontSize: '18px',
                    marginBottom: '20px'
                }}>Your payment has been processed successfully.</p>
                <button onClick={() => navigate('/')} style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    color: '#fff',
                    backgroundColor: '#007bff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginTop: 'auto',
                    marginBottom: 'auto'
                }}>Return to Home</button>
            </div>
        )
        
    }

    if (!cart || cart.items.length === 0) {
        return <div>Your cart is empty</div>;
    }

    const handleBackToCart = () => {
        navigate('/cart');
    }

    const cartItemCount = cart.items.length

    return (
        <div className="checkout__container">
            <h2>Checkout & Payment</h2>
            <ul>
                {cart.items.map(item => (
                    <li key={item.id}>
                        <h4>{item.product.name}</h4>
                        {item.product.image && (
                            <img
                                alt={item.product.name}
                                height='200px'
                                width='200px'
                                src={`${import.meta.env.VITE_API_URL}${item.product.image}`}
                            />
                        )}
                        <p>Price: ${item.product.price}</p>
                        <p>Quantity: {item.quantity}</p>
                    </li>
                ))}
            </ul>
            <h3>Total: ${calculateTotal()}</h3>

            <div className="checkout__buttons">
                <button onClick={handleBackToCart}>
                    <i>Back To Cart</i>
                </button>
                <button onClick={handlePaymentClick}>
                    <i className="bi bi-credit-card"></i>
                    <i>Ready to Pay</i>
                </button>
            </div>

            {isProcessing && <div>Processing your payment...</div>}

            {showModal && (
                <PaymentModal 
                    onClose={handleModalClose}
                    onSubmit={processPayment}
                    total={calculateTotal()}
                />
            )}

            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}

export default Checkout;
