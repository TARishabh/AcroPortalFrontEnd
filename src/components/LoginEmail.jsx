import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';


// #TODO  BUTTONS DAALNE HAI 2 ->  MARK, ALL PRESENT  
// #TODO  dark mode daalna hai
// #TODO view attendance ka page banana hai
// #TODO modal banana hai student ki display ke liye
// #TODO profile page banana hai User ka


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
        {console.log(res)};
        if (res.results === true){
            updatedMail(email);
            navigate('/enterpassword');
            SetAlert('Email Verified','success');
        }
        else if (res.results === false){
            navigate('/register');
            SetAlert('Please Register','success');
        }
    };


    return (
        <div className="login-container">
            <div className="pink-background">
                <h1 className='attendance-text'><strong>ATTENDANCE</strong></h1>
                <h1 className='made-text'><strong>MADE</strong></h1>
                <h1 className='simple-text'><strong>SIMPLE.</strong></h1>
            </div>
            <div className="login-form">
            <h1 className='welcome-text'>WELCOME TO ACROPORTAL</h1>
            <div id="alert-container">
            </div>
                <h2 style={{ marginBottom: '50px' }}>Login</h2>
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
