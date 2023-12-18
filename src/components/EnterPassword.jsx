import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';
// import backgroundImage from '../assets/abstract-blue-transparent-flow-wave-with-shadow-design-element_206325-733.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader, PacmanLoader } from "react-spinners";

export default function EnterPassword(props) {
    const { SetAlert } = props;
    const host = import.meta.env.VITE_BACKEND_URL
    const [password, setPassword] = useState('');
    const context = useContext(UserContext);
    const {updateToken, updateUserType } = context;
    const email = localStorage.getItem('userEmail');
    const [loading, setLoading] = useState(false); // Add loading state
    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`${host}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });
            const res = await response.json();
            if (res.results) {
                localStorage.setItem('authToken', res.results);
                updateToken(res.results);
                updateUserType(res.user_type);
                // SetAlert(res.message,'success');
                toast.success(res.message, { autoClose: 1300, style: { fontSize: '18px' }, draggablePercent: 20 });
                if (res.user_type === 'Student') {
                    navigate('/viewattendance');
                    // SetAlert('success','success');
                    // toast.success('success', { autoClose: 1300, style: { fontSize: '18px' }, draggablePercent: 20 })
                }
                else if (res.user_type === 'Faculty') {
                    navigate('/markattendance');
                    // SetAlert('success','success');
                    // toast.success('success', { autoClose: 1300, style: { fontSize: '18px' }, draggablePercent: 20 })
                }
            }
            else {
                // SetAlert('Invalid Credentials', 'danger');
                toast.error('Invalid Credentials', { autoClose: 1300, style: { fontSize: '18px' }, draggablePercent: 20 });
            };

        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching data:',{ autoClose: 1300, style: {fontSize:'500px'},draggablePercent: 20});
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


    const handleFormSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        handleOnSubmit(e);  // Call your custom form submission logic
    };


    return (
        <div id="main-container">
            <section className="auth-sidebar">
                <div className="auth-sidebar-content">
                    <a href="/" className="auth-sidebar-logo">
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
                    ></video>

                    <a style={{ display: "none" }} className="auth-sidebar-credit">
                        {/* @glebich */}
                    </a>
                </div>
            </section>
            <section className="content bg-image">
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
                                <label htmlFor="email">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your Password"
                                    className="rounded-input my-2"
                                    style={{ fontWeight: 'bold' }}
                                />
                            </form>
                            {/* <button onClick={handleOnSubmit} className='btn2 btn2--large btn2--full-width margin-t-20 btncustom' type="submit"><strong>Login</strong></button> */}
                            <button
                                onClick={handleOnSubmit}
                                className='btn2 btn2--large btn2--full-width margin-t-20 btncustom'
                                type="submit"
                                disabled={loading} // Disable the button when loading
                            >
                                {loading ? (
                                    <ClipLoader color={'#4285f4'} loading={true} size={35} />
                                ) : (
                                    <strong>Login</strong>
                                )}
                            </button>
                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
};

