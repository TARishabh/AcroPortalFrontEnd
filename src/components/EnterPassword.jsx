import React,{useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';

export default function EnterPassword(props) {
    const { SetAlert } = props;
    const host = import.meta.env.VITE_BACKEND_URL
    const [password, setPassword] = useState('');
    const context = useContext(UserContext);
    const { email,updateToken,updateUserType } = context;
    const navigate = useNavigate();

    const handleOnSubmit = async(e) =>{
        e.preventDefault();
        const response = await fetch(`${host}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:email,password:password}),
        });
        const res = await response.json();
        if (res.results ){
            localStorage.setItem('Authorization',res.results);
            updateToken(res.results);
            updateUserType(res.user_type);
            SetAlert(res.message,'success');
            if (res.user_type === 'Student'){
                navigate('/viewattendance');
                SetAlert('success','success');
            }
            else if (res.user_type === 'Faculty'){
                navigate('/markattendance');
                SetAlert('success','success');
            }
        }
        else{
            SetAlert('Invalid Credentials', 'danger');
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
                                <label htmlFor="email">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your Password"
                                    className="rounded-input my-2"
                                />
                            </form>
                            <button onClick={handleOnSubmit} className='btn2 btn2--large btn2--full-width margin-t-20 btncustom' type="submit"><strong>Login</strong></button>

                        </div>
                    </div>
                </main>
            </section>
        </div>
    );
};


//     return (
//         <div className="login-container">
//             <div className="pink-background">
//                 <h1 className='attendance-text'><strong>ATTENDANCE</strong></h1>
//                 <h1 className='made-text'><strong>MADE</strong></h1>
//                 <h1 className='simple-text'><strong>SIMPLE.</strong></h1>
//             </div>
//             <div className="login-form">
//             <h1 className='welcome-text'>WELCOME TO ACROPORTAL</h1>
//                 <h1 className='login-text' style={{ marginBottom: '50px' }}>Login</h1>
//                 <form>
//                         <div>
//                             <strong><label htmlFor="password">Password:</label></strong>
//                             <input
//                                 type="password"
//                                 placeholder="Enter Your Password"
//                                 className="rounded-input my-2"
//                                 value={password}
//                                 id='password'
//                                 name='password'
//                                 onChange={(e) => setPassword(e.target.value)}
//                             />
//                         </div>
//                     <button onClick={handleOnSubmit} className='continue-button' type="submit"><strong>Login</strong></button>
//                 </form>
//             </div>
//         </div>
//     );
// };
