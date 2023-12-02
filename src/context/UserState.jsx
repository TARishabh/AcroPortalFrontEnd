import React, { useState, useEffect } from 'react';
import UserContext from './userContext';

const UserState = (props) => {
    
    const [email,setEmail] = useState('');
    const [token,setToken] = useState('');
    const [userType,setUserType] = useState('');

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
        <UserContext.Provider value={{updatedMail,email,updateToken,token,updateUserType,userType}}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
