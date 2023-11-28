import React, { useState, useEffect } from 'react';
import UserContext from './userContext';

const UserState = (props) => {
    
    const [email,setEmail] = useState('');
    const [token,setToken] = useState('');

    const updateToken = (tokenValue) =>{
        setToken(tokenValue);
    }
    // const [userDetails,setUserDetails] = useState(
    //     {
    //         _id:"",enrollment_number:"",first_name:"",last_name:"",section:"",
    //         year:"",email:"",user_type:"",
    // }
    //     );

    // const updateUserDetails = async() =>{

    // }

    const updatedMail = (mail) =>{
        setEmail(mail);
    }
    return (
        <UserContext.Provider value={{updatedMail,email,updateToken,token}}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserState;
