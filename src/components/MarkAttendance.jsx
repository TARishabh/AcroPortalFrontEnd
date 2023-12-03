import React, { useEffect, useContext, useState, useRef } from 'react'
import UserContext from '../context/userContext';
import { useNavigate } from 'react-router-dom';

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
    const host = import.meta.env.VITE_BACKEND_URL
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const {userType} = context;
    const navigate = useNavigate();
    const token = localStorage.getItem('Authorization');
    useEffect(() => {
        if (userType === 'Student'){
            navigate('/viewattendance')
        }
        const fetchsubjects = async () => {
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
        const formattedDateReturned = formatDate(selectedDate);
        if (formattedTime[0] === '2' && formattedTime[1] === '4') {
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
        const response = await fetch(`${host}/attendance/markattendance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(data),
        });
        const res = await response.json();
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


    const onDoubleClickUser = (user_id) => {
        // Find the selected user details
        const selectedUser = users.find((user) => user._id === user_id);

        // Set the details to open in the modal
        setSelectedUserDetails(selectedUser);

        // Open the Bootstrap modal
        const modal = new window.bootstrap.Modal(document.getElementById('userDetailsModal'));
        modal.show();
    };


    return (
        <div className="mark-attendance-container">
            <h2 className="mark-attendance-heading"><strong>MARK ATTENDANCE</strong></h2>
            <form className="mark-attendance-form">
                <div className="d-flex">
                    {/* Subject Field */}
                    <div className="form-group flex-grow-1">
                        <label className="label my-2" htmlFor="subject">
                            Select Subject:
                        </label>
                        <select
                            className="select-field"
                            id="subject"
                            name="subject"
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
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
                    <div className="form-group flex-grow-1">
                        <label className="label my-2" htmlFor="date">
                            Select Date:
                        </label>
                        <input
                            className="input-field"
                            type="date"
                            id="date"
                            name="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
            </form>
            <div className='d-flex'>
                <div className="mark-all-checkbox my-1">
                    <input
                        style={{ border: '2px solid' }}
                        type="checkbox"
                        className="form-check-input"
                        id="selectAllCheckbox"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                    />
                    <label className="form-check-label mx-3 " htmlFor="selectAllCheckbox">
                        <strong>Mark All Present</strong>
                    </label>
                </div>
            </div>

            <div className="container custom-margin-user-container d-flex flex-wrap">
                {showStudents &&
                    users
                        .sort((a, b) => parseInt(a.enrollment_number.slice(10, 12)) - parseInt(b.enrollment_number.slice(11, 13)))
                        .map((user) => (
                            <div key={user._id} className="card student-card">
                                <button
                                    type="button"
                                    className="btn card-button"
                                    onClick={() => onclickUser(user._id)}
                                    onDoubleClick={()=> onDoubleClickUser(user._id)}
                                    style={{color: checkIfUserSelected(user._id) ? 'white' : 'black', backgroundColor: checkIfUserSelected(user._id) ? '#c4779d' : '#D9D9D9', padding: 0, border: 'none' }}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title">{user.enrollment_number.slice(10, 12)}</h5>
                                    </div>
                                </button>
                            </div>
                        ))}
            </div>
            <div className="d-flex justify-content-center">
                <button onClick={markAttendanceOfStudents} type="button" className="btn mark-button mt-4">Mark</button>
            </div>
            <div className="modal fade" id="userDetailsModal" tabIndex="-1" aria-labelledby="userDetailsModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 style={{fontWeight:'bold'}} className="modal-title" id="userDetailsModalLabel">User Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Display user details here */}
                            {selectedUserDetails && (
                                <div>
                                    <p><span style={{fontWeight:'bold'}}>Name: </span> <strong>{`${selectedUserDetails.first_name} ${selectedUserDetails.last_name}`}</strong></p>
                                    <p><span style={{fontWeight:'bold'}}>Email:</span> <strong>{selectedUserDetails.email}</strong></p>
                                    <p><span style={{fontWeight:'bold'}}>Enrollment Number:</span> <strong>{selectedUserDetails.enrollment_number}</strong></p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};