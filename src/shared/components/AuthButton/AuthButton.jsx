import React from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JwtContext } from "../../contexts/JwtContext";


export default function AuthButton () {

    const {jwt, setJwt} = useContext(JwtContext);

    let navigate = useNavigate();

    const userJSON = localStorage.getItem("name");
    const user = userJSON ? JSON.parse(userJSON) : null;
    
    const signOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('email_verified');
        setJwt(null);
        navigate("/");
    }
    return jwt && user ? (<p> Welcome! {user} <button onClick={signOut}>Sign out</button></p>) : (<p>You are not logged in.</p>);
}
