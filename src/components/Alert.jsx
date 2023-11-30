import React from 'react';

export default function Alert(props) {
    return (
        props.alert && (
            <div
                className={`alert alert-${props.alert.type} alert-dismissible fade show role=alert`}
                style={{ position: 'fixed', top: '40px', right: '40px', width: '200px', zIndex: 1000 }}
            >
                {console.log(props.alert.message)}
                {props.alert.message}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        )
    );
}







// import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';

// const CustomAlert = ({ message, type }) => {
//     const [isVisible, setIsVisible] = useState(true);

//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             setIsVisible(false);
//         }, 2000); // Hide the alert after 5 seconds

//         return () => clearTimeout(timeout);
//     }, []);

//     return (
//         <div
//         className={`custom-alert alert alert-${type} ${isVisible ? 'show' : 'hide'}`}
//         role="alert"
//         style={{ position: 'fixed', top: '40px', right: '40px', width: '200px', zIndex: 1000 }}
//         >
//             {message}
//             {console.log(isVisible)}
//         </div>
//     );
// };

// // Function to trigger the alert
// const showAlert = (message, type) => {
//     const alertContainer = document.getElementById('alert-container');
//     const alertElement = <CustomAlert key={Date.now()} message={message} type={type} />;
//     ReactDOM.render(alertElement, alertContainer);
// };

// export default showAlert;