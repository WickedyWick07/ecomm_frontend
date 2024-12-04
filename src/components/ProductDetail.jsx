import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { AuthContext } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "../styles/ProductDetail.css"; // Importing the CSS file for styling

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { pk } = useParams();
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const fetchDetails = async () => {
    try {
      const response = await api.get(`api/products/${pk}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setProduct(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);

    try {
      if (pk) {
        console.log("Product ID:", pk);
        fetchDetails();
      }
    } catch (error) {
      console.log("there was an error fetching the product detail...", error);
    }
    setLoading(false);
  }, [pk]);

  if (loading)
    return (
      <div>
        <img src="https://i.gifer.com/1amw.gif" alt="loading.gif" />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;

  const handleAddClick = () => {
    addToCart(product.id);
  };

  const handleNavigation = () => {
    navigate("/cart");
  };

  const handleBackToHome = () => {
    navigate("/products");
  };

  return (
    <>
      {product && (
        <div className="product__detail">
          <h2 className="product__name">{product.name}</h2>
          {product.image && (
            <img
              className="product__image"
              src={product.image}
              alt={product.name}
            />
          )}
          <p className="product__description">{product.description}</p>
          <p className="product__price">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-tag-fill"
              viewBox="0 0 16 16"
            >
              <path d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            </svg>
            Price: R{product.price}
          </p>
          <p className="product__stock">Stock: {product.stock}</p>
          <div className="product__buttons">
            <button className="btn add-to-cart" onClick={handleAddClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-cart-plus-fill"
                viewBox="0 0 16 16"
              >
                <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0" />
              </svg>
              Add to Cart
            </button>
            <button className="btn go-to-cart" onClick={handleNavigation}>
              Go to Cart
            </button>
            <button className="btn back-to-products" onClick={handleBackToHome}>
              Back to products list
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductDetail;
