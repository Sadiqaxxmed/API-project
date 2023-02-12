import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import "./LoginForm.css";

function LoginFormModal() {

    const dispatch = useDispatch();

    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();

    const handleSubmit = (e) => {

        e.preventDefault();
        setErrors([]);

        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                }
            );
    };

    return (
        <>
            <div className="login-form">
                <h1>Log In</h1>
                <ul className="errors-messages">
                    {errors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                    ))}
                </ul>
                <form onSubmit={handleSubmit} className='form'>
                    <div className="input-fields">
                        <label>
                            Username or Email
                        </label>
                        <input
                            type="text"
                            value={credential}
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-fields">
                        <label>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className='login-button' id='log-button'>Log In</button>
                </form>
            </div>
        </>
    );
}

export default LoginFormModal;
