import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';

const Login = (props) => {
    const { SetAlert } = props;
    const context = useContext(UserContext);
    const { updatedMail } = context;  // Update this line
    const [email, setEmail] = useState('');
    const [secretkey, setSecretKey] = useState('');
    const [showSecretKey, setShowSecretKey] = useState(false);
    const navigate = useNavigate();
    const host = import.meta.env.VITE_BACKEND_URL

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
            body: JSON.stringify({ email: email }),
        });
        const res = await response.json();
        if (res.results === true) {
            updatedMail(email);
            navigate('/enterpassword');
            SetAlert('Email Verified', 'success');
        }
        else if (res.results === false) {
            navigate('/register');
            SetAlert('Please Register', 'primary');
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
    };


    return (
        // <div className="login-container">
        //     <section className="pink-background">
        //         <h1 className='attendance-text'><strong>ATTENDANCE</strong></h1>
        //         <h1 className='made-text'><strong>MADE</strong></h1>
        //         <h1 className='simple-text'><strong>SIMPLE.</strong></h1>
        //     </section>
        //     <section className="login-form">
        //         <div className='auth-content'>
        //             <div id="alert-container"></div>
        //             <h2 className='login-text' style={{ font: "bold 24px/29px Mona Sans, Helvetica Neue"}}>Sign in to Dribbble</h2>
        //             <div className="auth-connections">
        //                 <form className='auth-google-form '></form>
        //             </div>
        //             <hr className='divider sign-in' />
        //             <div className='auth-form sign-in-form'>
        //                 <form>
        //                     <div>
        //                         <label className='email-text' htmlFor="email">Email:</label>
        //                         <input
        //                             type="email"
        //                             id="email"
        //                             name="email"
        //                             value={email}
        //                             onChange={handleEmailChange}
        //                             placeholder="Enter your email"
        //                             className="rounded-input my-2"
        //                         />
        //                     </div>
        //                     <button onClick={handleOnSubmit} className='continue-button' type="submit"><strong>Continue</strong></button>
        //                 </form>
        //             </div>
        //         </div>
        //     </section>
        // </div>
        <div id="main-container">
            <section className="auth-sidebar">
                <div className="auth-sidebar-content">
                    <a href="/" className="auth-sidebar-logo">
                        {/* Your SVG code here */}
                    </a>
                    <video
                        playsInline
                        className="auth-sidebar-video"
                        autoPlay
                        loop
                        muted
                        src="https://cdn.dribbble.com/uploads/48226/original/b8bd4e4273cceae2889d9d259b04f732.mp4?1689028949"
                    ></video>
                    <a className="auth-sidebar-credit" href="https://dribbble.com/shots/21785427-Mushroom-world-for-XR">
                        @glebich
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
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Enter your email"
                                    className="rounded-input my-2"
                                />
                            </form>
                            {/* <p className="auth-link color-deep-blue-sea-light-20">
                                Don't have an account? <a className="underline" href="/signup/new">Sign up</a>
                            </p> */}
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
};

export default Login;