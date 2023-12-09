import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';


export default function Register(props) {
    const userContext = useContext(UserContext);
    const { SetAlert } = props;
    const host = import.meta.env.VITE_BACKEND_URL;
    const [secretkey, setSecretKey] = useState('');
    const navigate = useNavigate();
    const [email, setEmail] = useState(userContext.email || '');
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

        if (password !== confirmpassword){
            SetAlert("Password Fields Doesn't Match",'danger');
        }
        // You can add additional validation logic here before making the fetch call
        let data = {
            email: email,
            password: password,
            password2: confirmpassword,
            first_name: firstname,
            last_name: lastname,
        }
        if (showSecretKey === true) {
            data.secret_key = secretkey;
        }
        else if (showSecretKey === false) {
            data.enrollment_number = enrollmentnumber;
        }
        const response = await fetch(`${host}/user/registeruser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const res = await response.json();
        if (res.results) {
            // navigate('/login')
            console.log(results);
            SetAlert('Account Created Successfully','success')
        }
        else if (res.error){
            SetAlert(res.error,'danger')
        }
        else {
            if (Array.isArray(res)) {
                // If it's an array, loop through it
                res.forEach((element) => {
                    let message;

                    if (element.message) {
                        message = element.message;
                    } else if (element.errors) {
                        message = element.errors;
                    }
                    SetAlert(message, 'danger');
                });
            } else {
                // If it's not an array, handle individual case
                let message;

                if (res.message) {
                    message = res.message;
                } else if (res.errors) {
                    message = res.errors;
                }
                SetAlert(message, 'danger');
            };
        };
    }

    return (
        <div id="main-container">
            <section className="auth-sidebar">
                <div className="auth-sidebar-content">
                    <a href="/" className="auth-sidebar-logo">
                        {/* Your SVG code here */}
                    </a>
                    <video controls
                        playsInline
                        className="auth-sidebar-video"
                        autoPlay
                        loop
                        muted
                        type='video/mp4'
                        // src="https://cdn.dribbble.com/uploads/48226/original/b8bd4e4273cceae2889d9d259b04f732.mp4?1689028949"
                        src='../assets/a_video_of_stars_galaxy_seed6246393802789651653.mp4'
                    ></video>

                    <a style={{display:"none"}} className="auth-sidebar-credit" href="https://dribbble.com/shots/21785427-Mushroom-world-for-XR">
                        {/* @glebich */}
                    </a>
                </div>
            </section>
            <section className="content" data-content-container="">
                <main>
                    <div className="auth-content">
                        <h2>Login to Acroportal</h2>
                        <div className="auth-connections">
                            {/* Google Sign-In Button */}
                            <div
                                id="g_id_onload"
                                data-client_id="32073492121-s6ur8ti01mh34gq2bpbufb8ujdfrpn4v.apps.googleusercontent.com"
                                data-login_uri="https://dribbble.com/auth/google_one_tap/callback"
                                data-ux_mode="redirect"
                            ></div>
                            <form className="auth-google-form" action="/auth/google" acceptCharset="UTF-8" method="post">
                                {/* Google Sign-In button code */}
                            </form>
                        </div>
                        {/* <hr className="divider sign-in" /> */}
                        <div className="auth-form sign-in-form">
                            <form action="/session" acceptCharset="UTF-8" method="post">
                                <label htmlFor="email">Email</label>
                                <input
                        type="email"
                        id="remail"
                        name="remail"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className="rounded-input my-2"
                    />
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Enter Your Password"
                        className="rounded-input my-2"
                        value={password}
                        id='rpassword'
                        name='rpassword'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="confirmpassword">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Enter Your Password Again"
                        className="rounded-input my-2"
                        value={confirmpassword}
                        id='rconfirmpassword'
                        name='rconfirmpassword'
                        onChange={(e) => setconfirmPassword(e.target.value)}
                    />
                    <label htmlFor="firstname">First Name:</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter First Name"
                        className="rounded-input my-2"
                    />
                    <label htmlFor="lastname">Last Name</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={lastname}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter Last Name"
                        className="rounded-input my-2"
                    />
                    {showSecretKey === true ? (
                        <>
                    <label htmlFor="secretkey">Secret Key</label>
                    <input
                    type="password"
                    placeholder="Secret key"
                    className="rounded-input my-2"
                    value={secretkey}
                    id='secretkey'
                    name='secretkey'
                    onChange={(e) => setSecretKey(e.target.value)}
                />
                </>
                    ):(<>
                    <label htmlFor="enrollmentnumber">Enrollment Number</label>
                    <input
                            type="text"
                            id="enrollmentnumber"
                            name="enrollmentnumber"
                            value={enrollmentnumber}
                            onChange={(e) => setEnrollmentNumber(e.target.value)}
                            placeholder="Enter Enrollment Number"
                            className="rounded-input my-2"
                        />
                    </>)}
                            </form>
                            <button onClick={handleCheckState} className='btn2 btn2--large btn2--full-width margin-t-20 btncustom' type="submit"><strong>Register</strong></button>

                        </div>
                    </div>
                </main>
            </section>
        </div>        )
    }
    
    // <div className="login-container">
    //     <div className="pink-background">
    //         <h1 className='attendance-text'><strong>ATTENDANCE</strong></h1>
    //         <h1 className='made-text'><strong>MADE</strong></h1>
    //         <h1 className='simple-text'><strong>SIMPLE.</strong></h1>
    //     </div>
    //     <div className="login-form">
    //         <h1 className='welcome-text-create'>WELCOME TO ACROPORTAL</h1>
    //         <h2 className='create-acctount-text'>Create Account</h2>
    //         <form>
    //             <div>
    //                 <strong><label htmlFor="email">Email:</label></strong>
                    // <input
                    //     type="email"
                    //     id="remail"
                    //     name="remail"
                    //     value={email}
                    //     onChange={handleEmailChange}
                    //     placeholder="Enter your email"
                    //     className="rounded-input my-2"
                    // />
    //             </div>
    //             <div>
    //                 <strong><label htmlFor="password">Password:</label></strong>
                    // <input
                    //     type="password"
                    //     placeholder="Enter Your Password"
                    //     className="rounded-input my-2"
                    //     value={password}
                    //     id='rpassword'
                    //     name='rpassword'
                    //     onChange={(e) => setPassword(e.target.value)}
                    // />
    //             </div>
    //             <div>
    //                 <strong><label htmlFor="confirmpassword">Confirm Password:</label></strong>
                    // <input
                    //     type="password"
                    //     placeholder="Enter Your Password Again"
                    //     className="rounded-input my-2"
                    //     value={confirmpassword}
                    //     id='rconfirmpassword'
                    //     name='rconfirmpassword'
                    //     onChange={(e) => setconfirmPassword(e.target.value)}
                    // />
    //             </div>
    //             <div>
    //                 <strong><label htmlFor="firstname">First Name:</label></strong>
                    // <input
                    //     type="text"
                    //     id="firstname"
                    //     name="firstname"
                    //     value={firstname}
                    //     onChange={(e) => setFirstName(e.target.value)}
                    //     placeholder="Enter First Name"
                    //     className="rounded-input my-2"
                    // />
    //             </div>
    //             <div>
    //                 <strong><label htmlFor="lastname">Last Name:</label></strong>
                    // <input
                    //     type="text"
                    //     id="lastname"
                    //     name="lastname"
                    //     value={lastname}
                    //     onChange={(e) => setLastName(e.target.value)}
                    //     placeholder="Enter Last Name"
                    //     className="rounded-input my-2"
                    // />
    //             </div>
    //             {showSecretKey === true ? (
    //                 <div>
    //                     <strong><label htmlFor="secretkey">Secret Key:</label></strong>
                        // <input
                        //     type="password"
                        //     placeholder="Secret key"
                        //     className="rounded-input my-2"
                        //     value={secretkey}
                        //     id='secretkey'
                        //     name='secretkey'
                        //     onChange={(e) => setSecretKey(e.target.value)}
                        // />
    //                 </div>
    //             ) : (
    //                 <div>
    //                     <strong><label htmlFor="enrollmentnumber">Enrollment Number:</label></strong>
                        // <input
                        //     type="text"
                        //     id="enrollmentnumber"
                        //     name="enrollmentnumber"
                        //     value={enrollmentnumber}
                        //     onChange={(e) => setEnrollmentNumber(e.target.value)}
                        //     placeholder="Enter Enrollment Number"
                        //     className="rounded-input my-2"
                        // />
    //                 </div>
    //             )}
    //             <button onClick={handleCheckState} className='continue-button' type="submit"><strong>Continue</strong></button>
    //         </form>
    //     </div>
    // </div>