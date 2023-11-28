import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
const Login = (props) => {
    const host = 'http://127.0.0.1:3000';
    const { SetAlert } = props;
    const context = useContext(UserContext);
    const { updatedMail } = context;  // Update this line
    const [email, setEmail] = useState('');
    const [secretkey, setSecretKey] = useState('');
    const [showSecretKey, setShowSecretKey] = useState(false);
    const navigate = useNavigate();
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Check if there are any numbers in the email address
        const hasNumbers = /\d/.test(e.target.value);
        setShowSecretKey(!hasNumbers);
    };
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`${host}/user/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:email}),
        });
        const res = await response.json();
        console.log(res);
        if (res.results === true){
            updatedMail(email);
            navigate('/enterpassword');
        }
        else if (res.results === false){
            navigate('/register');
        }
        else{
            SetAlert('Invalid Credentials', 'danger');
        }
    };


    return (
        <div className="login-container">
            <div className="pink-background"></div>
            <div className="login-form">
                <h1 style={{ marginBottom: '50px' }}>Login</h1>
                <form>
                    <div>
                        <strong><label htmlFor="email">Email:</label></strong>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            className="rounded-input my-2"
                        />
                    </div>
                    <button onClick={handleOnSubmit} className='continue-button' type="submit"><strong>Continue</strong></button>
                </form>
            </div>
        </div>
    );
};

export default Login;



                    {/* <strong><label for="password">Password:</label></strong>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="rounded-input my-2"
                    /> */}
