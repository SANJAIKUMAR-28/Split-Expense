import React, { useState } from "react";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import '../css/login-page.css'

const Login = () => {
    const [loginCard, setLoginCard] = useState(true);

    return (
        <div className="login">
            <div className="container">
            {loginCard ? (
                <LoginCard switchToSignup={() => setLoginCard(false)} />
            ) : (
                <SignupCard switchToSignin={() => setLoginCard(true)}/>
            )}
            </div>
        </div>
    );
};

export default Login;
