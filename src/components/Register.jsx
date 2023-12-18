import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader, PacmanLoader } from "react-spinners";

export default function Register(props) {
    const userContext = useContext(UserContext);
    const { SetAlert } = props;
    const host = import.meta.env.VITE_BACKEND_URL;
    const [secretkey, setSecretKey] = useState('');
    const navigate = useNavigate();
    const [email, setEmail] = useState(localStorage.getItem('userEmail') || userContext.email || '');
    const [showSecretKey, setShowSecretKey] = useState(true);
    const [password, setPassword] = useState('');
    const [confirmpassword, setconfirmPassword] = useState('');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [enrollmentnumber, setEnrollmentNumber] = useState('');
    const [checkstate, setCheckState] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        handleCheckState(e);  // Call your custom form submission logic
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        // Check if there are any numbers in the email address
        const hasNumbers = /\d/.test(e.target.value);
        setShowSecretKey(!hasNumbers);
    };


    const checkEmailNumber = (email) => {
        const hasNumbers = /\d/.test(email);
        setShowSecretKey(!hasNumbers);
    };

    const checkPasswordMatch = () => {
        setCheckState(password === confirmpassword);
    };

    useEffect(() => {
        checkPasswordMatch();
        checkEmailNumber(email);

    }, [password, confirmpassword,email]);

    const handleCheckState = async (e) => {
        e.preventDefault();
        setLoading(true);
        // if (password !== confirmpassword){
        //     // SetAlert("Password Fields Doesn't Match",'danger');
        //     toast.error("Password Fields Doesn't Match",{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
        // }
        // You can add additional validation logic here before making the fetch call

        try {
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
                localStorage.setItem('authToken',res.results.token);
                userContext.updateToken(res.results.token);
                userContext.updateUserType(res.results.user_type);
                if (res.results.user_type === 'Student'){
                    navigate('/viewattendance');
                }
                else if (res.results.user_type === 'Faculty'){
                    navigate('/markattendance');
                }
                // SetAlert('Account Created Successfully','success')
                toast.success("Account Created Successfully",{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
                
            }
            else if (res.error){
                // SetAlert(res.error,'danger')
                toast.error(res.error,{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
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
                        // SetAlert(message, 'danger');
                        toast.error(message,{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
                    });
                } else {
                    // If it's not an array, handle individual case
                    let message;
    
                    if (res.message) {
                        message = res.message;
                    } else if (res.errors) {
                        message = res.errors;
                    }
                    // SetAlert(message, 'danger');
                    toast.error(message,{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
                };
            };
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }

    // if (loading) {
    //     return (
    //         <div className="sweet-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    //             <ClipLoader color={'#4285f4'} loading={true} size={150} aria-label="Loading Spinner" data-testid="loader" />
    //         </div>
    //     );
    // }


    return (
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
                        controls={false}
                        preload="none"
                        src="https://cdn.dribbble.com/uploads/48226/original/b8bd4e4273cceae2889d9d259b04f732.mp4?1689028949"
                        // src='../assets/a_video_of_stars_galaxy_seed6246393802789651653.mp4'
                    ></video>
                    {/* <video data-testid="video-asset" src='../assets/istockphoto-813115280-640-adpp-is_rsPnJnen.mp4' autoPlay loop muted></video> */}

                    <a style={{display:"none"}} className="auth-sidebar-credit">
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
                                data-ux_mode="redirect"
                            ></div>
                            <form className="auth-google-form" action="/auth/google" acceptCharset="UTF-8" method="post">
                                {/* Google Sign-In button code */}
                            </form>
                        </div>
                        {/* <hr className="divider sign-in" /> */}
                        <div className="auth-form sign-in-form">
                            <form onSubmit={handleFormSubmit}>
                                <label htmlFor="email">Email</label>
                                <input
                        type="email"
                        id="remail"
                        name="remail"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email"
                        className="rounded-input my-2"
                        style={{fontWeight:'bold'}}
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
                        style={{fontWeight:'bold'}}
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
                        style={{fontWeight:'bold'}}
                    />
                    <label htmlFor="firstname">First Name</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={firstname}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter First Name"
                        className="rounded-input my-2"
                        style={{fontWeight:'bold'}}
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
                        style={{fontWeight:'bold'}}
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
                    style={{fontWeight:'bold'}}
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
                            style={{fontWeight:'bold'}}
                        />
                    </>)}
                            </form>
                            {/* <button onClick={handleCheckState} className='btn2 btn2--large btn2--full-width margin-t-20 btncustom' type="submit"><strong>Register</strong></button> */}
                            <button
                                onClick={handleCheckState}
                                className='btn2 btn2--large btn2--full-width margin-t-20 btncustom'
                                type="submit"
                                disabled={loading} // Disable the button when loading
                            >
                                {loading ? (
                                    <ClipLoader color={'#4285f4'} loading={true} size={35} />
                                ) : (
                                    <strong>Register</strong>
                                )}
                            </button>
                        </div>
                    </div>
                </main>
            </section>
        </div>        )
    }
    