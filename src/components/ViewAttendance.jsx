import React, { useState, CSSProperties, useContext, useEffect } from 'react'
import UserContext from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { ClipLoader, PacmanLoader } from "react-spinners";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewAttendance(props) {
    const { SetAlert } = props;
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceResults, setAttendanceResults] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const host = import.meta.env.VITE_BACKEND_URL
    const context = useContext(UserContext);
    const token = localStorage.getItem('authToken');
    const navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseSubjects = await fetch(`${host}/attendance/getsubjects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                const resSubjects = await responseSubjects.json();
                setSubjects(resSubjects.results);

                const responseAttendances = await fetch(`${host}/attendance/viewattendance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token,
                    },
                });
                const resAttendances = await responseAttendances.json();
                setAttendanceResults(resAttendances.results);

            } catch (error) {
                console.error('Error fetching data:', error);
                // Handle error if needed
                // SetAlert('', 'error');
                toast.error('Error fetching data. Please try again later.',{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20});
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [context, token]);


    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: '2-digit', year: 'numeric' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-IN', options);
        return formattedDate;
    };


    const updateAttendancesBySubject = async (e) => {
        setSelectedSubject(e.target.value);
        const response = await fetch(`${host}/attendance/viewattendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ subject_id: e.target.value })
        });
        const res = await response.json();
        setAttendanceResults(res.results);
    };

    const updateAttendancesByDate = async (e) => {
        setSelectedDate(new Date(e.target.value));
        const formattedDate = formatDate(new Date(e.target.value));
        const response = await fetch(`${host}/attendance/viewattendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ date: formattedDate })
        });
        const res = await response.json();
        setAttendanceResults(res.results);
    }

    if (loading) {
        return (
            <div className="sweet-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                {/* <ClipLoader color={'#4285f4'} loading={true} size={150} aria-label="Loading Spinner" data-testid="loader" /> */}
                <PacmanLoader color={'#4285f4'} loading={true} size={80} aria-label="Loading Spinner" data-testid="loader" />
            </div>
        );
    }

    return (
        <div>
            {context.authenticated ? (<div className="mark-attendance-container">
                <h2 className="mark-attendance-heading"><strong>VIEW ATTENDANCE</strong></h2>
                <form className="mark-attendance-form">
                    <div className="d-flex">
                        <div className="form-group flex-grow-1">
                            <label className="label my-2" htmlFor="subject">
                                Select Subject:
                            </label>
                            <select
                                className="form-control ifields"
                                id="subject"
                                name="subject"
                                value={selectedSubject}
                                onChange={updateAttendancesBySubject}
                            >
                                <option value="" disabled>
                                    Select a subject
                                </option>
                                {subjects.length > 0 &&
                                    subjects.map((subject) => (
                                        <option key={subject._id} value={subject._id}>
                                            {subject.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        {/* Date Field */}
                        <div className="form-group flex-grow-1 mx-2">
                            <label className="label my-2" htmlFor="date">
                                Select Date:
                            </label>
                            <input
                                className="form-control ifields"
                                type="date"
                                id="date"
                                name="date"
                                value={selectedDate.toISOString().split('T')[0]}
                                onChange={updateAttendancesByDate}
                            />
                        </div>
                    </div>
                </form>
                <div className='d-flex'>
                    <div className="form-check-label form-check my-1">
                        <strong className='total-count'>TOTAL ATTENDANCE COUNT : {attendanceResults.length}</strong>
                    </div>
                </div>

                <div className="container custom-margin-user-container">
                    {attendanceResults.map((attendance, index) => (
                        <div
                            key={attendance._id}
                            className={`row mb-3 custom-row-size`}
                            style={{ backgroundColor: `${index % 2 === 0 ? '#245ba8' : '#d9d9d9'}`, color: `${index % 2 === 0 ? 'white' : 'black'}` }}
                        >
                            <div className="col">
                                <strong>{subjects.find(sub => sub._id === attendance.subject_id)?.name}</strong>
                            </div>
                            <div className="col">
                                <strong>{formatDate(attendance.date)}</strong>
                            </div>
                            <div className="col">
                                <strong>{attendance.time.slice(11, 16)}</strong>
                            </div>
                            <div className="col">
                                <strong>{attendance.section}</strong>
                            </div>
                        </div>
                    ))}
                </div>
            </div>) : (
                <div className="sweet-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <ClipLoader
                        color={'#4285f4'}
                        loading={true}
                        size={150}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            )
            }
        </div>
    )
}
