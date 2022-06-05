import React, { useRef } from 'react';
import { useHistory } from 'react-router';
import {Link} from 'react-router-dom';
import './register.css';
import { API } from '../../apiCalls';

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Passwords don't match");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await API.post("/auth/register", user);
        history.push("/login");
      } catch(err) {
        console.log(err);
      }
    }
  };

  return (
    <div className='register'>
      <div className="registerWrapper">
        <div className="registerLeft">
          <h3 className="registerLogo">leat</h3>
          <span className="registerDesc">Post stuff</span>
        </div>
        <div className="registerRight">
          <form className="registerBox" onSubmit={handleClick}>
            <input placeholder="email" type="email" required className="registerInput" ref={email} />
            <input placeholder="username" type="text" required className="registerInput" ref={username} />
            <input placeholder="password" type="password" required minLength="6" className="registerPassword" ref={password} />
            <input placeholder="repeat password" type="password" required minLength="6" className="registerPassword" ref={passwordAgain} />
            <button className="registerButton">Sign Up</button>
            <Link to='/login'>
              <button className="registerLoginButton">Already have an account?</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
