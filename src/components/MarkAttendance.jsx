import React, { useEffect, useContext, useState, useRef } from 'react'
import UserContext from '../context/userContext';

export default function MarkAttendance(props) {
    const { SetAlert } = props;
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showStudents, setShowStudents] = useState(true);
    const context = useContext(UserContext);
    const now = new Date();
    const host = 'http://127.0.0.1:3000';
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        const fetchsubjects = async () => {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1OTA3YzgwODJhZTRkZDVkZDJkMzM5In0sImlhdCI6MTcwMTA5MDE2OX0.MI3lEwylnpkyIW7o8SLyzxHIvygSq3ROYKEPxiiV1oM'
            const response = await fetch(`${host}/attendance/getsubjects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            const res = await response.json();
            setSubjects(res.results);
        };
        const fetchUsers = async () => {
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1OTA3YzgwODJhZTRkZDVkZDJkMzM5In0sImlhdCI6MTcwMTA5MDE2OX0.MI3lEwylnpkyIW7o8SLyzxHIvygSq3ROYKEPxiiV1oM';
            const response = await fetch(`${host}/user/getallusers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            const res = await response.json();
            setUsers(res.results);
        }

        fetchUsers();
        fetchsubjects();
    }, [context]);
    const onclickUser = (currentUser) => {
        if (checkIfUserSelected(currentUser)) {
            const removedStudents = selectedStudents.filter((student) => (student !== currentUser))
            setSelectedStudents(removedStudents);
        }
        else {
            setSelectedStudents(selectedStudents => [...selectedStudents, currentUser])
        }
    }
    const handleSelectAllChange = () => {
        setSelectAll(!selectAll);
        // Update selectedStudents based on the "Select All" checkbox state
        if (!selectAll) {
            const allUserIds = users.map(user => user._id);
            setSelectedStudents(allUserIds);
        } else {
            setSelectedStudents([]);
        }
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const checkIfUserSelected = (currentUser) => {
        for (let index = 0; index < selectedStudents.length; index++) {
            const element = selectedStudents[index];
            if (element === currentUser) {
                return true;
            }
        }
        return false;
    }
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
    };

    let formattedTime = now.toLocaleTimeString('en-US', options);


    const markAttendanceOfStudents = async () => {
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2OGE0NDdkM2VmNjU1ZjIzOTQxZTBlIn0sImlhdCI6MTcwMTM1NjY0N30.-OCMy6P9991KMm8eGJF-dM9IND7Rh1FTkAi6AfwJ0JM';
        const formattedDateReturned = formatDate(selectedDate);
        if (formattedTime[0] === '2' && formattedTime[1] === '4'){
            formattedTime = '00:00'
        };
        const data = {
            student_id: selectedStudents,
            subject_id: selectedSubject,
            date: formattedDateReturned,
            time: formattedTime,
            section: "DS",
            year: 'III',
        }
        console.log(data);
        const response = await fetch(`${host}/attendance/markattendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data),
        });
        const res = await response.json();
        console.log(res);
        if (res.results) {
            // navigate('/login')
        }
        else if (res.error) {
            SetAlert(res.error, 'danger')
        }
        else if (res.message) {
            SetAlert(res.message, 'success')
        }
        else {
            if (Array.isArray(res)) {
                // If it's an array, loop through it
                res.forEach((element) => {
                    let message;

                    if (element.message) {
                        message = element.message;
                    } else if (element.errors) {
                        message = element.errors;
                    }
                    SetAlert(message, 'danger');
                });
            } else {
                // If it's not an array, handle individual case
                let message;

                if (res.message) {
                    message = res.message;
                } else if (res.errors) {
                    message = res.errors;
                }
                SetAlert(message, 'danger');
            };
        };
    }

    return (
        <div className='container'>
            <h2 className='my-3 text-center'>Mark Attendance</h2>
            <div className='d-flex custom-margin'>
                <div className="container">
                    <label htmlFor="subject"><strong>Select Subject:</strong></label><br />
                    <select className='my-2 form-control' style={{ width: "20rem" }} id="subject" name="subject" value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); }}>
                        <option value="" disabled>
                            Select a subject
                        </option>
                        {subjects.length > 0 &&
                            subjects.map((subject) => (
                                <option key={subject._id} value={subject._id}>
                                    {subject.name} - {subject.code}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div className='container'>
                    <label htmlFor="date"><strong>Select Date:</strong></label><br />
                    <input className='my-2 form-control' style={{ width: "15rem" }} type='date' id='date' name='date' value={selectedDate.toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value))}></input>
                </div>
            </div>
            <div className="d-flex justify-content-between align-items-center my-3">
                <div className="form-check">
                    <input style={{border:'1px solid'}}
                        type="checkbox"
                        className="form-check-input"
                        id="selectAllCheckbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                    />
                    <label className="form-check-label mx-2" htmlFor="selectAllCheckbox">
                        <strong>Mark All Present</strong>
                    </label>
                </div>
            </div>
            <div className="container custom-margin-user-container d-flex flex-wrap">
                {showStudents &&
                    users.sort((a, b) => parseInt(a.enrollment_number.slice(10, 12)) - parseInt(b.enrollment_number.slice(11, 13)))
                        .map((user, index) => (
                            <div key={user._id} className="card mx-3 mb-3" style={{ width: "8rem" }}>
                                <button
                                    type="button"
                                    className="btn btn-card-body"
                                    onClick={() => onclickUser(user._id)}
                                    style={{ backgroundColor: checkIfUserSelected(user._id) ? '#c4779d' : '#D9D9D9', padding: 0, border: 'none' }}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title text-center">{user.enrollment_number.slice(10, 12)}</h5>
                                    </div>
                                </button>
                            </div>
                        ))
                }
            </div>
            <div className="d-flex justify-content-center">
                <button onClick={markAttendanceOfStudents} style={{ backgroundColor: '#c4779d', borderRadius: '50px', color: 'white', padding: '8px 20px', fontSize: '1.5rem', textAlign: 'center' }} type="button" className="btn mt-3">Mark</button>
            </div>
        </div>
    );
}
