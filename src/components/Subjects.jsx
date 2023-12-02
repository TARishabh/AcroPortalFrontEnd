import React,{useContext} from 'react'
import UserContext from '../context/userContext';

export default function Subjects() {
    const getSubjectDetails = async() =>{
        const context = useContext(UserContext);
        const { token } = context;
        const host = import.meta.env.VITE_BACKEND_URL
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
