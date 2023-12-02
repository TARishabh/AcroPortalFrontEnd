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
        <div className="login-container">
            <div className="pink-background">
                <h1 className='attendance-text'><strong>ATTENDANCE</strong></h1>
                <h1 className='made-text'><strong>MADE</strong></h1>
                <h1 className='simple-text'><strong>SIMPLE.</strong></h1>
            </div>
            <div className="login-form">
            <h1 className='welcome-text'>WELCOME TO ACROPORTAL</h1>
                <h1 className='login-text' style={{ marginBottom: '50px' }}>Login</h1>
                <form>
                        <div>
                            <strong><label htmlFor="password">Password:</label></strong>
                            <input
                                type="password"
                                placeholder="Enter Your Password"
                                className="rounded-input my-2"
                                value={password}
                                id='password'
                                name='password'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    <button onClick={handleOnSubmit} className='continue-button' type="submit"><strong>Login</strong></button>
                </form>
            </div>
        </div>
    );
};
