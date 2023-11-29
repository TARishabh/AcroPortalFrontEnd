import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Register() {
    const host = 'http://127.0.0.1:3000';
    const [secretkey, setSecretKey] = useState('');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [enrollmentnumber, setEnrollmentNumber] = useState('');
    const [checkstate, setCheckState] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Check if there are any numbers in the email address
        const hasNumbers = /\d/.test(e.target.value);
        setShowSecretKey(!hasNumbers);
    };

    const checkPasswordMatch = () => {
        setCheckState(password === confirmpassword);
    };

    useEffect(() => {
        checkPasswordMatch();
    }, [password, confirmpassword]);

    const handleCheckState = async (e) => {
        e.preventDefault();

        // You can add additional validation logic here before making the fetch call
        let data = {
            email: email,
            password:password,
            password2:confirmpassword,
            first_name:firstname,
            last_name:lastname,
        }
        if (showSecretKey === true){
            data.secret_key = secretkey;
        }
        else if (showSecretKey === false) {
            data.enrollment_number = enrollmentnumber;
        }
        console.log(data);
        const response = await fetch(`${host}/user/registeruser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const res = await response.json();
        console.log(res);
        if (res.results){
            navigate('/login')
        }
        else{
            // SetAlert('Invalid Credentials', 'danger');
        }
    };

    return (
        <div className="login-container">
            <div className="pink-background"></div>
            <div className="login-form">
                <h1 style={{ marginBottom: '50px' }}>Create Account</h1>
                <form>
                    <div>
                        <strong><label htmlFor="email">Email:</label></strong>
                        <input
                            type="email"
                            id="remail"
                            name="remail"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                            className="rounded-input my-2"
                        />
                    </div>
                    <div>
                        <strong><label htmlFor="password">Password:</label></strong>
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            className="rounded-input my-2"
                            value={password}
                            id='rpassword'
                            name='rpassword'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <strong><label htmlFor="confirmpassword">Confirm Password:</label></strong>
                        <input
                            type="password"
                            placeholder="Enter Your Password Again"
                            className="rounded-input my-2"
                            value={confirmpassword}
                            id='rconfirmpassword'
                            name='rconfirmpassword'
                            onChange={(e) => setconfirmPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <strong><label htmlFor="firstname">First Name:</label></strong>
                        <input
                            type="text"
                            id="firstname"
                            name="firstname"
                            value={firstname}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter First Name"
                            className="rounded-input my-2"
                        />
                    </div>
                    <div>
                        <strong><label htmlFor="lastname">Last Name:</label></strong>
                        <input
                            type="text"
                            id="lastname"
                            name="lastname"
                            value={lastname}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Enter Last Name"
                            className="rounded-input my-2"
                        />
                    </div>
                    {showSecretKey === true ? (
                        <div>
                            <strong><label htmlFor="secretkey">Secret Key:</label></strong>
                            <input
                                type="password"
                                placeholder="Secret key"
                                className="rounded-input my-2"
                                value={secretkey}
                                id='secretkey'
                                name='secretkey'
                                onChange={(e) => setSecretKey(e.target.value)}
                            />
                        </div>
                    ):(
                        <div>
                        <strong><label htmlFor="enrollmentnumber">Enrollment Number:</label></strong>
                        <input
                            type="text"
                            id="enrollmentnumber"
                            name="enrollmentnumber"
                            value={enrollmentnumber}
                            onChange={(e) => setEnrollmentNumber(e.target.value)}
                            placeholder="Enter Enrollment Number"
                            className="rounded-input my-2"
                        />
                    </div>
                    )}
                    <button disabled={!checkstate} onClick={handleCheckState} className='continue-button' type="submit"><strong>Continue</strong></button>
                </form>
            </div>
        </div>
    )
}
