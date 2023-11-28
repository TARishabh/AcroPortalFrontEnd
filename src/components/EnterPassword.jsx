import React,{useState,useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/userContext';

export default function EnterPassword() {
    const host = 'http://127.0.0.1:3000';
    const [password, setPassword] = useState('');
    const context = useContext(UserContext);
    const { email,updateToken } = context;

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
        console.log(res);
        if (res.results ){
            localStorage.setItem('token',res.results)
            updateToken(res.results);
            SetAlert(res.message,'success');
            if (res.user_type === 'Student'){
                navigate('/home');
            }
            else if (res.user_type === 'Faculty'){
                navigate('/markattendance');
            }
        }
        else{
            SetAlert('Invalid Credentials', 'danger');
        }
    }

    return (
        <div className="login-container">
            <div className="pink-background"></div>
            <div className="login-form">
                <h1 style={{ marginBottom: '50px' }}>Login</h1>
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
