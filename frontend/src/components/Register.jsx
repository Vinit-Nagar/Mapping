import { FaMapMarkerAlt } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import axios from "axios";
import { useRef, useState } from "react";
import "./register.css";

function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      await axios.post("/users/register", newUser);
      setSuccess(true);
      setError(false);
    } catch (error) {
      setError(true);
      setSuccess(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <FaMapMarkerAlt className="logoIcon" />
        <span>LamaPin</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input
          type="password"
          min="6"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="registerBtn" type="submit">
          Register
        </button>
        {success && (
          <span className="success">Successful. You can login now!</span>
        )}
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <GiCancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}

export default Register;
