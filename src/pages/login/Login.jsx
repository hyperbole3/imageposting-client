import React, { useRef, useContext } from 'react';
import './login.css';
import {Link} from 'react-router-dom';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core';

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleSubmitClick = async (e) => {
    e.preventDefault();
    await loginCall({email: email.current.value, password: password.current.value}, dispatch);
  };

  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">leat</h3>
          <span className="loginDesc">Post stuff</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmitClick}>
            <input placeholder="email" type="email" required className="loginEmail" ref={email} />
            <input placeholder="password" type="password" required minLength="6" className="loginPassword" ref={password} />
            <button className="loginButton">
              {isFetching ? <CircularProgress color="inherit" size="24px" /> : "Log In"}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link to='/register'>
              <button className="loginRegisterButton">
                {isFetching ? <CircularProgress color="inherit" size="24px" /> : "Create a new Account"}
              </button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  )
}
