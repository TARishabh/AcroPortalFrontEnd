import React,{useContext} from 'react'
import UserContext from '../context/userContext';

export default function Subjects() {
    const getSubjectDetails = async() =>{
        const context = useContext(UserContext);
        const { token } = context;
        const host = 'http://127.0.0.1:3000';
        const response = await fetch(`${host}/attendance/getsubjects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':token
            },
        });
        const res = await response.json();
    }
    return (
        <div>
            
        </div>
    )
}
