import React, { useEffect, useContext, useState, useRef } from 'react'
import UserContext from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClipLoader } from "react-spinners";


export default function MarkAttendance(props) {
    const { SetAlert } = props;
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showStudents, setShowStudents] = useState(true);
    const context = useContext(UserContext);
    const [loading, setLoading] = useState(true); // Add loading state
    const [buttonLoader, setButtonLoader] = useState(false); // Add loading state
    const now = new Date();
    const host = import.meta.env.VITE_BACKEND_URL
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUserDetails, setSelectedUserDetails] = useState(null);
    const { userType,authenticated } = context;
    const navigate = useNavigate();
    const token = localStorage.getItem('authToken');
    
    useEffect(() => {
        const fetchData = async () =>{
            try{
                if (userType === 'Student') {
                    navigate('/viewattendance')
                }
                const fetchsubjects = await fetch(`${host}/attendance/getsubjects`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                });
                const res = await fetchsubjects.json();
                setSubjects(res.results);

                const fetchUsers = await fetch(`${host}/user/getallusers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    },
                });
                const res_api = await fetchUsers.json();
                setUsers(res_api.results);
                
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching data:',{ autoClose: 1300, style: {fontSize:'500px'},draggablePercent: 20});
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [context,token]);

    const buttonStyle = {
        backgroundColor: '#245ba8',
        borderRadius: '15px',
        color: 'white',
        padding: '8px 20px',
        fontSize: '1.5rem',
        textAlign: 'center',
    };

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
        setButtonLoader(true);
        try {
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
                // SetAlert(res.error, 'danger')
                toast.error(res.error,{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
            }
            else if (res.message) {
                // SetAlert(res.message, 'success')
                console.log(res.message);
                toast.success(res.message,{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
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
                        // SetAlert(message, 'danger');
                        toast.error(message,{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
    
                    });
                } else {
                    // If it's not an array, handle individual case
                    let message;
    
                    if (res.message) {
                        message = res.message;
                    } else if (res.errors) {
                        message = res.errors;
                    }
                    // SetAlert(message, 'danger');
                    toast.error(message,{ autoClose: 1300, style: {fontSize:'18px'},draggablePercent: 20})
                };
            };
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error fetching data:',{ autoClose: 1300, style: {fontSize:'500px'},draggablePercent: 20});
        } finally {
            setButtonLoader(false);
        }
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

    if (loading) {
        return (
            <div className="sweet-loading" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <ClipLoader color={'#4285f4'} loading={true} size={150} aria-label="Loading Spinner" data-testid="loader" />
            </div>
        );
    }

    return (
        <div>
        {authenticated ? (<div className="mark-attendance-container">
            <h2 className="mark-attendance-heading"><strong>MARK ATTENDANCE</strong></h2>
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
                            onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        />
                    </div>
                </div>
            </form>
            <div className="form-check">
                <input
                    style={{ border: '2px solid'}}
                    type="checkbox"
                    className="form-check-input"
                    id="selectAllCheckbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                />
                <label className="form-check-label mx-3" htmlFor="selectAllCheckbox">
                    <strong>Mark All Present</strong>
                </label>
            </div>

            <div className="container custom-margin-user-container d-flex flex-wrap student-cards-container">
                {showStudents &&
                    users
                        .sort((a, b) => parseInt(a.enrollment_number.slice(10, 12)) - parseInt(b.enrollment_number.slice(11, 13)))
                        .map((user) => (
                            <div key={user._id} className="card student-card">
                                <button
                                    type="button"
                                    className="btn card-button"
                                    onClick={() => onclickUser(user._id)}
                                    onDoubleClick={() => onDoubleClickUser(user._id)}
                                    style={{ color: checkIfUserSelected(user._id) ? 'white' : 'black', backgroundColor: checkIfUserSelected(user._id) ? '#245ba8' : '#D9D9D9', padding: 0, border: 'none' }}
                                >
                                    <div className="card-body">
                                        <h5 className="card-title">{user.enrollment_number.slice(10, 12)}</h5>
                                    </div>
                                </button>
                            </div>
                        ))}
            </div>
            <div className="d-flex justify-content-center">
                <button style={buttonStyle} disabled={buttonLoader} onClick={markAttendanceOfStudents} type="submit" className="btn mark-button mt-4">
                    {buttonLoader ? (<ClipLoader color={'#4285f4'} loading={true} size={35} />):(
                        <strong>Mark</strong>
                    )}
                </button>
            </div>
            <div className="modal fade" id="userDetailsModal" tabIndex="-1" aria-labelledby="userDetailsModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 style={{ fontWeight: 'bold' }} className="modal-title" id="userDetailsModalLabel">User Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* Display user details here */}
                            {selectedUserDetails && (
                                <div>
                                    <p><span style={{ fontWeight: 'bold' }}>Name: </span> <strong>{`${selectedUserDetails.first_name} ${selectedUserDetails.last_name}`}</strong></p>
                                    <p><span style={{ fontWeight: 'bold' }}>Email:</span> <strong>{selectedUserDetails.email}</strong></p>
                                    <p><span style={{ fontWeight: 'bold' }}>Enrollment Number:</span> <strong>{selectedUserDetails.enrollment_number}</strong></p>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button style={{backgroundColor:'#245ba8'}} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>):
        (
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
    );
};