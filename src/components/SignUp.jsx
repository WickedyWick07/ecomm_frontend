import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../../services/api";
import "../styles/Signup.css"; // Import CSS file

const Signup = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password1 !== password2) {
            setMessage('Passwords do not match...');
            return;
        }

        if (password1.length < 8) {
            setMessage('Password must be at least 8 characters long.');
            return;
        }

        try {
            const response = await api.post(`api/auth/registration/`, {
                username,
                email,
                firstname,
                lastname,
                password1,
                password2,
            });
            await login(username, password1);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    setMessage("Validation Error. Check your input fields.");
                    if (error.response.data.password) {
                        setMessage(`Password error: ${error.response.data.password.join(' ')}`);
                    }
                } else {
                    setMessage("Error creating user.");
                }
            } else if (error.request) {
                setMessage("Network error. Please try again later...");
            } else {
                setMessage("Unknown error occurred.");
            }
            console.error("Error creating user:", error);
        }
    }

    return (
        <div className="signup-container">
            <form onSubmit={handleSubmit}>
                <h2>Sign Up</h2>
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="text" name="firstname" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                <input type="text" name="lastname" placeholder="Lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />

                <input type="password" name="password1" placeholder="Password" value={password1} onChange={(e) => setPassword1(e.target.value)} />
                <input type="password" name="password2" placeholder="Confirm Password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
}

export default Signup;
