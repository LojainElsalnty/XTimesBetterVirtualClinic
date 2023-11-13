import React, { useState, useEffect } from 'react';
import styles from './scheduleFollowUpPage.module.css'
// Axios
import axios from 'axios';

// React Router DOM
import { useNavigate } from 'react-router-dom';

const ScheduleFollowUp = () => {
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [followUpDateTime, setFollowUpDateTime] = useState('');
    const [showFollowUpSection, setShowFollowUpSection] = useState(false);
    //const [username, setUsername] = useState(""); 

    // const currentUser = "iaitchison1";
    const navigate = useNavigate();
    //Authenticate part
    const accessToken = sessionStorage.getItem('accessToken');
    const [load, setLoad] = useState(true);
    const [username, setUsername] = useState('');
    
    
    useEffect(() => {
        if (username.length != 0) {
            setLoad(false);
        }
    }, [username]);
    async function checkAuthentication() {
        await axios({
            method: 'get',
            url: 'http://localhost:5000/authentication/checkAccessToken',
            headers: {
                "Content-Type": "application/json",
                'Authorization': accessToken,
                'User-type': 'doctor',
            },
        })
            .then((response) => {
                console.log(response);
                setUsername(response.data.username);
                //setLoad(false);
            })
            .catch((error) => {
                //setLoad(false);
                navigate('/login');

            });
    }

    const xTest = checkAuthentication();

    //Authenticate part

    const getPastAppointments = async () => {
        const response = await fetch(`http://localhost:5000/doctor/appointments/pastAppointments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setAppointments(data);
        } else {
            throw new Error('Error filtering appointments by status');
        }
    };

    const createFollowUp = async (patientUsername, appointmentTime, followUpTime) => {
        const followUpData = {
            doctor_username: username,
            patient_username: patientUsername,
            appointmentDateTime: appointmentTime,
            followUpDateTime: followUpTime,
        };

        try {
            const response = await fetch('http://localhost:5000/doctor/appointments/scheduleFollowUp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(followUpData),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Follow-up created:', result);
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Network error:', error.message);
        }
    };

    useEffect(() => {
        getPastAppointments();
    }, []);

    const handleScheduleFollowUp = (patientUsername, appointmentTime) => {
        setSelectedAppointment({ patientUsername, appointmentTime });
        setShowFollowUpSection(true);
    };

    const handleFollowUpDateTimeChange = (e) => {
        setFollowUpDateTime(e.target.value);
    };

    const handleCreateFollowUp = () => {
        const { patientUsername, appointmentTime } = selectedAppointment;
        createFollowUp(patientUsername, appointmentTime, followUpDateTime);
        setSelectedAppointment(null);
        setShowFollowUpSection(false);
        window.alert("Appointment Successfully added")
    };

    //Authenticate
    if (load) {
        return (<div>Loading</div>)
    }    

    // Render the component
    return (
        <div>
            <h2>Schedule Follow Up Appointment</h2>
            <table>
                <thead>
                    <tr>
                        <th>Patient</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Time</th>
                        <th>Follow Up</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment._id}>
                            <td>{appointment.patient_username}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</td>
                            <td>{appointment.time}</td>
                            <td>
                                <button
                                    onClick={() => handleScheduleFollowUp(appointment.patient_username, appointment.time)}
                                >
                                    Schedule a Follow Up
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showFollowUpSection && (
                <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', width:'800px',position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)' }}>
                    <h2>Follow Up Details</h2>
                    <h4 style={{textAlign:'left'}}>Patient : </h4>
                    <p> {selectedAppointment.patientUsername}</p>
                    <h4>Appointment Time:</h4>
                    <p> {selectedAppointment.appointmentTime}</p>
                    <h2>Enter Follow Up Date and Time</h2>
                    <br/>
                    <input
                        type="datetime-local"
                        value={followUpDateTime}
                        onChange={handleFollowUpDateTimeChange}
                    />
                    <br/>
                    <br/>
                    <button style={{backgroundColor:'#052a51', color:"white"}} onClick={handleCreateFollowUp}>Submit Follow Up</button>
                </div>
            )}
        </div>
    );
};

export default ScheduleFollowUp;