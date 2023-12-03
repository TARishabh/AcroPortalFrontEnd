import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginEmail from './components/LoginEmail';
import Alert from './components/Alert';
import EnterPassword from './components/EnterPassword';
import Register from './components/Register';
import UserState from './context/UserState';
import Home from './components/Home';
import MarkAttendance from './components/MarkAttendance';
import ViewAttendance from './components/ViewAttendance';


function App() {
  const [alert, updatedAlert] = useState(null);
  const SetAlert = (message, type) => {
    updatedAlert({
      message: message,
      type: type
    })

    setTimeout(() => {
      updatedAlert(null);
    }, 1700);
  }

  return (
    <UserState>
      <Router>
        <Alert alert={alert}></Alert>
        <Routes>
        <Route exact path="/" element={<LoginEmail SetAlert={SetAlert} />} />
          <Route exact path="/login" element={<LoginEmail SetAlert={SetAlert} />} />
          <Route exact path="/register" element={<Register SetAlert={SetAlert} />} />
          <Route exact path="/enterpassword" element={<EnterPassword SetAlert={SetAlert} />} />
          <Route exact path="/markattendance" element={<MarkAttendance SetAlert={SetAlert} />} />
          <Route exact path="/viewattendance" element={<ViewAttendance SetAlert={SetAlert} />} />
        </Routes>
      </Router>
    </UserState>
  )
};

export default App
