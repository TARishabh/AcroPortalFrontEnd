import React, { useEffect, useContext, useState, useRef } from 'react'
import UserContext from '../context/userContext';

export default function MarkAttendance() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [showStudents, setShowStudents] = useState(true);
    const context = useContext(UserContext);
    const ref = useRef();
    useEffect(() => {
        const host = 'http://127.0.0.1:3000';
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

    const checkIfUserSelected = (currentUser) => {
        for (let index = 0; index < selectedStudents.length; index++) {
            const element = selectedStudents[index];
            if (element === currentUser) {
                return true;
            }
        }
        return false;
    }
    return (
        <div className='container'>
            <h2 className='my-3 text-center'>Mark Attendance</h2>
            <div className='d-flex custom-margin'>
                <div className="container">
                    <label htmlFor="subject"><strong>Select Subject:</strong></label><br />
                    <select className='my-2' style={{ width: "40%" }} id="subject" name="subject" value={selectedSubject} onChange={(e) => { setSelectedSubject(e.target.value); }}>
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
                    <input className='my-2' style={{ width: "30%" }} type='date' id='date' name='date' value={selectedDate.toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value))}></input>
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
        </div>
    );
}























// import React, { useState, useEffect, useContext } from 'react';
// import UserContext from '../context/userContext';

// export default function MarkAttendance() {
//     const [subjects, setSubjects] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [users, setUsers] = useState([]);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [selectedStudents, setSelectedStudents] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedStudentDetails, setSelectedStudentDetails] = useState({});
//     const [markedStudents, setMarkedStudents] = useState([]);
//     const context = useContext(UserContext);

//     useEffect(() => {
//         // Fetch subjects when the component mounts
//         const fetchSubjects = async () => {
//             const { token } = context;
//             const auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1OTA3YzgwODJhZTRkZDVkZDJkMzM5In0sImlhdCI6MTcwMTA5MDE2OX0.MI3lEwylnpkyIW7o8SLyzxHIvygSq3ROYKEPxiiV1oM'; // Replace with your actual token
//             const host = 'http://127.0.0.1:3000';
//             const response = await fetch(`${host}/attendance/getsubjects`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': auth_token,
//                 },
//             });
//             const res = await response.json();
//             setSubjects(res.results);
//         };

//         const fetchUsers = async () => {
//             const { token } = context;
//             const auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU1OTA3YzgwODJhZTRkZDVkZDJkMzM5In0sImlhdCI6MTcwMTA5MDE2OX0.MI3lEwylnpkyIW7o8SLyzxHIvygSq3ROYKEPxiiV1oM'; // Replace with your actual token
//             const host = 'http://127.0.0.1:3000';
//             const response = await fetch(`${host}/user/getallusers`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': auth_token,
//                 },
//             });
//             const res = await response.json();
//             setUsers(res.results);
//         };

//         fetchSubjects();
//         fetchUsers();
//     }, [context]); // Include context in the dependencies array
//     const handleCardClick = (userId) => {
//         setSelectedStudents((prevStudents) => {
//             if (!prevStudents.includes(userId)) {
//                 return [...prevStudents, userId];
//             }
//             return prevStudents;
//         });
//     };

//     const handleCardDoubleClick = (userId) => {
//         // Fetch details for the selected user
//         const selectedUserDetails = users.find((user) => user._id === userId);
//         setSelectedStudentDetails(selectedUserDetails);
//         setShowModal(true);
//     };

//     const handleCloseModal = () => {
//         setShowModal(false);
//     };

//     const handleMarkAttendance = () => {
//         // Call the API for marking attendance
//         // Include subject_id, date, selectedStudents, and current time
//         // ...

//         // Clear the selected students after marking attendance
//         setSelectedStudents([]);
//     };
//     const handleMarkIndividualAttendance = (userId) => {
//         // Call the API for marking individual attendance
//         // Include subject_id, date, [userId], and current time
//         // ...

//         // Update the markedStudents state with the selected student
//         console.log('hello')
//         setMarkedStudents((prevMarkedStudents) => [...prevMarkedStudents, userId]);
//     };

//     return (
//         <div className="mark-attendance-container">
//             <h2 className="centered-heading">Mark Attendance</h2>

//             <div className="flex-container">
//                 <div className="input-group">
//                     <label htmlFor="subject"><strong>Select Subject:</strong></label>
//                     <select
//                         id="subject"
//                         name="subject"
//                         value={selectedSubject}
//                         onChange={(e) => setSelectedSubject(e.target.value)}
//                     >
//                         <option value="" disabled>
//                             Select a subject
//                         </option>
//                         {subjects.length > 0 &&
//                             subjects.map((subject) => (
//                                 <option key={subject._id} value={subject._id}>
//                                     {subject.name} - {subject.code}
//                                 </option>
//                             ))}
//                     </select>
//                 </div>

//                 <div className="input-group flex-container-date">
//                     <label htmlFor="date"><strong>Select Date:</strong></label>
//                     <strong><input
//                         type="date"
//                         id="date"
//                         name="date"
//                         value={selectedDate.toISOString().split('T')[0]}
//                         onChange={(e) => setSelectedDate(new Date(e.target.value))}
//                     /></strong>
//                 </div>
//             </div>


//             <div className="users-container">
//                 {users
//                     .sort((a, b) => parseInt(a.enrollment_number.slice(11, 13)) - parseInt(b.enrollment_number.slice(11, 13)))
//                     .map((user) => (
//                         <div
//                             key={user._id}
//                             className={`card user-card ${selectedStudents.includes(user._id) ? 'selected' : ''} ${markedStudents.includes(user._id) ? 'marked' : ''}`}
//                             onClick={() => handleCardClick(user._id)}
//                             onDoubleClick={() => handleCardDoubleClick(user._id)}
//                         >
//                             <div className="card-body">
//                                 <h5 className="card-title">{user.enrollment_number.slice(11, 13)}</h5>
//                             </div>
//                             <button
//                                 type="button"
//                                 className="btn btn-mark"
//                                 onClick={() => handleMarkIndividualAttendance(user._id)}
//                             >
//                                 Mark
//                             </button>
//                         </div>
//                     ))}
//             </div>

//             <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
//                 <div className="modal-dialog" role="document">
//                     <div className="modal-content">
//                         <div className="modal-header">
//                             <h5 className="modal-title">Student Details</h5>
//                             <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
//                                 <span aria-hidden="true">&times;</span>
//                             </button>
//                         </div>
//                         <div className="modal-body">
//                             <p><strong>Name:</strong> {selectedStudentDetails.first_name} {selectedStudentDetails.last_name}</p>
//                             <p><strong>Email:</strong> {selectedStudentDetails.email}</p>
//                             <p><strong>Enrollment Number:</strong> {selectedStudentDetails.enrollment_number}</p>
//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
//                                 Close
//                             </button>
//                             <button type="button" className="btn btn-primary" onClick={handleMarkAttendance}>
//                                 Mark Attendance
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <button type="button" className="btn btn-mark-all" onClick={handleMarkAttendance}>
//                 Mark Attendance
//             </button>
//         </div>
//     );
// }