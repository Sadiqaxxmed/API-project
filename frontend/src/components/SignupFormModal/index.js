import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  return (
    <>
    <div className="login-form">
      <h1>Sign Up</h1>
      <ul className="errors-messages">
          { errors && errors.map((error, idx) => ( <li key={idx}>{error}</li> ))}
      </ul>
      <form onSubmit={handleSubmit} className='form'>
      <div className="input-fields">
        <label>
          Email
        </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
      </div>
      <div className="input-fields">
        <label>
          Username
        </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
      <div className="input-fields">
        <label>
          First Name
        </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
      <div className="input-fields">
        <label>
          Last Name
        </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
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
      <div className="input-fields">
        <label>
          Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
      </div>
        <button type="submit" className='signup-button ' id='sign-button'>Sign Up</button>
      </form>
      </div>
    </>
  );
}

export default SignupFormModal;
