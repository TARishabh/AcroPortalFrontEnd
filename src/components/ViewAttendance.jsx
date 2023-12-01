import React, { useState, useContext, useEffect } from 'react'
import UserContext from '../context/userContext';

export default function ViewAttendance(props) {
    const { SetAlert } = props;
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attendanceResults, setAttendanceResults] = useState([]);
    const host = 'http://127.0.0.1:3000';
    const context = useContext(UserContext);
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2OGE0NDdkM2VmNjU1ZjIzOTQxZTBlIn0sImlhdCI6MTcwMTM2MjgwOX0.9CRjz44poFXihha9gkugYyDVUlBPO2d9TlFZDgGMYjA';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2OGQzNTZkMGYyNzU3ZTI2NjM2MTk2In0sImlhdCI6MTcwMTM2ODcwMn0.x9CAkjh32Aj2-GGu7Pp1Cs-Vbk03b8Xhp94LEZenXWc'

    useEffect(() => {
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
        const fetchattendances = async () => {
            const response = await fetch(`${host}/attendance/viewattendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            const res = await response.json();
            setAttendanceResults(res.results);
        };

        fetchsubjects();
        fetchattendances();
    }, [context]);

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
        console.log(res);
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
        console.log(res);
        setAttendanceResults(res.results);
    }

    return (
        <div className="mark-attendance-container">
        <h2 className="mark-attendance-heading">VIEW ATTENDANCE</h2>
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
                        onChange={updateAttendancesByDate}
                    />
                </div>
            </div>
        </form>
        <div className='d-flex'>
                <div className="mark-all-checkbox my-1">
                    <strong>TOTAL ATTENDANCE COUNT : {attendanceResults.length}</strong>
                </div>
            </div>

            <div className="container custom-margin-user-container">
                {attendanceResults.map((attendance, index) => (
                    <div
                        key={attendance._id}
                        className={`row mb-3`}
                        style={{ padding: '10px', borderRadius: '5px', backgroundColor: `${index % 2 === 0 ? '#c4779d' : '#d9d9d9'}`, color: `${index % 2 === 0 ? 'white' : 'black'}` }}
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
        </div>
    )
}
























// import React, { useState, useContext, useEffect } from 'react'
// import UserContext from '../context/userContext';

// export default function ViewAttendance(props) {
//     const { SetAlert } = props;
//     const [subjects, setSubjects] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [attendanceResults, setAttendanceResults] = useState([]);
//     const host = 'http://127.0.0.1:3000';
//     const context = useContext(UserContext);
//     // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2OGE0NDdkM2VmNjU1ZjIzOTQxZTBlIn0sImlhdCI6MTcwMTM2MjgwOX0.9CRjz44poFXihha9gkugYyDVUlBPO2d9TlFZDgGMYjA';
//     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU2OGQzNTZkMGYyNzU3ZTI2NjM2MTk2In0sImlhdCI6MTcwMTM2ODcwMn0.x9CAkjh32Aj2-GGu7Pp1Cs-Vbk03b8Xhp94LEZenXWc'

//     useEffect(() => {
//         const fetchsubjects = async () => {

//             const response = await fetch(`${host}/attendance/getsubjects`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': token
//                 },
//             });
//             const res = await response.json();
//             setSubjects(res.results);
//         };
//         const fetchattendances = async () => {
//             const response = await fetch(`${host}/attendance/viewattendance`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': token
//                 },
//             });
//             const res = await response.json();
//             setAttendanceResults(res.results);
//         };

//         fetchsubjects();
//         fetchattendances();
//     }, [context]);

//     const formatDate = (dateString) => {
//         const options = { day: 'numeric', month: '2-digit', year: 'numeric' };
//         const formattedDate = new Date(dateString).toLocaleDateString('en-IN', options);
//         return formattedDate;
//     };


//     const updateAttendancesBySubject = async (e) => {
//         setSelectedSubject(e.target.value);
//         const response = await fetch(`${host}/attendance/viewattendance`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': token
//             },
//             body: JSON.stringify({ subject_id: e.target.value })
//         });
//         const res = await response.json();
//         console.log(res);
//         setAttendanceResults(res.results);
//     };

//     const updateAttendancesByDate = async (e) => {
//         setSelectedDate(new Date(e.target.value));
//         const formattedDate = formatDate(new Date(e.target.value));
//         const response = await fetch(`${host}/attendance/viewattendance`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': token
//             },
//             body: JSON.stringify({ date: formattedDate })
//         });
//         const res = await response.json();
//         console.log(res);
//         setAttendanceResults(res.results);
//     }



//     return (
//         <div className='container'>
//             <h2 className='my-3 text-center'>View Attendance</h2>
//             <div className='d-flex custom-margin'>
//                 <div className="container">
//                     <label htmlFor="subject"><strong>Select Subject:</strong></label><br />
//                     <select className='my-2 form-control' style={{ width: "20rem" }} id="subject" name="subject" value={selectedSubject} onChange={updateAttendancesBySubject}>
//                         <option value="" disabled>
//                             Select a subject
//                         </option>
//                         {subjects.length > 0 &&
//                             subjects.map((subject) => (
//                                 <option key={subject._id} value={subject._id}>
//                                     {subject.name} - {subject.code}
//                                 </option>
//                             ))
//                         }
//                     </select>
//                 </div>
//                 <div className='container'>
//                     <label htmlFor="date"><strong>Select Date:</strong></label><br />
//                     <input className='my-2 form-control' style={{ width: "15rem" }} type='date' id='date' name='date' value={selectedDate.toISOString().split('T')[0]} onChange={updateAttendancesByDate}></input>
//                 </div>
//             </div>
//             <div className="d-flex justify-content-center mt-3">
//                 <span><strong>Total Attendance Count: {attendanceResults.length}</strong></span>
//             </div>
//             <div className="container custom-margin-user-container">
//                 {attendanceResults.map((attendance, index) => (
//                     <div
//                         key={attendance._id}
//                         className={`row mb-3`}
//                         style={{ padding: '10px', borderRadius: '5px', backgroundColor: `${index % 2 === 0 ? '#c4779d' : '#d9d9d9'}`, color: `${index % 2 === 0 ? 'white' : 'black'}` }}
//                     >
//                         <div className="col">
//                             <strong>{subjects.find(sub => sub._id === attendance.subject_id)?.name}</strong>
//                         </div>
//                         <div className="col">
//                             <strong>{formatDate(attendance.date)}</strong>
//                         </div>
//                         <div className="col">
//                             <strong>{attendance.time.slice(11,16)}</strong>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     )
// }
