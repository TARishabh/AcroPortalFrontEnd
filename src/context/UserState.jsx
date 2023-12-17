import React, { useState, useEffect } from 'react';
import UserContext from './userContext';

const UserState = (props) => {
    
    const [email,setEmail] = useState('');
    const [token,setToken] = useState('');
    const [authenticated,setAuthenticated] = useState(false);
    const [userType,setUserType] = useState('');

    useEffect(()=>{
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            setEmail(storedEmail);
        }
        const token = localStorage.getItem('authToken');
        if (token){
            setAuthenticated(true);
        }
    },[])

    const updateAuthenticationStatus = (status) => {
        setAuthenticated(status);
    };

    const updateToken = (tokenValue) =>{
        setToken(tokenValue);
    };

    const updateUserType = (user) =>{
        setUserType(user);
    };

    const updatedMail = (mail) =>{
        setEmail(mail);
    };
    return (
        <UserContext.Provider value={{updatedMail,email,updateToken,token,updateUserType,userType,updateAuthenticationStatus,authenticated}}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
