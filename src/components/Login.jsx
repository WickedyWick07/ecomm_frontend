import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Import CSS file

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
        } catch (error) {
            setError("Invalid username or password");
        }
    }

    return (
        <div className="login__container">
            <form className="form-container" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
            {error && <p className="error">{error}</p>}
            <p className="register-link">Don't have an account? <a href="/signup">Register</a></p>
        </div>
    );
}

export default Login;
