import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const LoginCard = ({ switchToSignup }) => {
    const [number, setNumber] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch("http://localhost:8080/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ mobile: number }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                alert(data.error || "Something went wrong");
                return;
            }

            console.log("User signed in:", data.user);
    
            navigate("/dashboard", { state: { user: data.user } });
    
        } catch (err) {
            console.error("Signin failed:", err);
            toast.warning("Failed to Login, Try again!");
        }
    };
    

    return (
        <div className="loginCard">
            <h2>Easy Split</h2>
            <p>Login with mobile number to view your expenses!</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={number}
                    placeholder="Enter your mobile number"
                    onChange={(e) => setNumber(e.target.value)}
                    required
                />
                <button id="submit"type="submit">Login</button>
                <p>
                    Not Registered?{" "}
                    <span
                        style={{ color: "blue", cursor: "pointer" }}
                        onClick={switchToSignup}
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
};

export default LoginCard;
