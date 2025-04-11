import React, { useState } from "react";
import { toast } from "react-toastify";

const SigunpCard =({switchToSignin}) =>{

    const [name, setName] = useState("")
    const [number, setNumber] = useState("")

    const handleSubmit = async (e) =>{
        e.preventDefault()

        try{
            const response = await fetch("http://localhost:8080/signup",{
                method: "POST",
                headers: {
                    "Content-type":"application/json",
                },
                body: JSON.stringify({name:name, mobile:number}),
            });

            const data = await response.json();

            if(!response.ok){
                alert(data.error || "Something went wrong");
                return;
            }
            console.log("Account created:", data.user);
            toast.success("Account created Successfully, " + data.user.Name + "!");
            switchToSignin();
        } catch(err){
            console.error("Registration failed:", err);
            toast.warning("Failed to create account. Try again!");
        }
    }

    return(
        <div className="signupCard">
        <h2>User Registration</h2>
        <p>Create your Easy Split account using your mobile number!</p>
        <form onSubmit={handleSubmit}>
        <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                required
            />
            <input
                type="text"
                value={number}
                placeholder="Enter your mobile number"
                onChange={(e) => setNumber(e.target.value)}
                required
            />
            <button id="submit" type="submit">Create</button>
            <p>
                Already an user?{" "}
                <span
                    style={{ color: "blue", cursor: "pointer" }}
                    onClick={switchToSignin}
                >
                    Sign in
                </span>
            </p>
        </form>
    </div>
    )
}

export default SigunpCard;