import React, { useState, useEffect } from 'react';
import styles from './FilterAppointmentsForPatientByDate.module.css'
// Axios
import axios from 'axios';

const AppointmentsByDateViewPatient = () => {

    // State variables
    const [appointments, setAppointments] = useState([]);
    const [showAppointments, setShowAppointments] = useState(false);
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitClicked, setIsSubmitClicked] = useState(false);
    const [isDataFetched, setIsDataFetched] = useState(false);

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
                'User-type': 'patient',
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

    const buildFetchUrl = (chosenDate) => {
        const formattedDate = formatDate(chosenDate);
        return `http://localhost:5000/patient/filterAppointmentsByDateForPatient/filter?date=${encodeURIComponent(formattedDate)}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };


    // useEffect hook to fetch appointments when showAppointments is true
    useEffect(() => {
        if (showAppointments && isSubmitClicked && !isDataFetched) {
            filterAppointmentsByDate(date);
        }
    }, [showAppointments, date, isSubmitClicked, isDataFetched]);

    const resetIsSubmitClicked = () => {
        setIsSubmitClicked(false);
    };
    // function to filter appointments by status
    const filterAppointmentsByDate = async (chosenDate) => {
        setMessage('');
        const response = await fetch(buildFetchUrl(chosenDate), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': accessToken,
            },
        });

        if (response.status === 200) {
            const data = await response.json();
            setAppointments(data);
            if (data.length === 0) {
                setMessage('No appointments found for the entered date');
            }
        } else {
            throw new Error('Error filtering appointments by date');
        }

        setIsDataFetched(true);

        resetIsSubmitClicked();

    };

    // function to handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Get the chosen status from the state
        const chosenDate = date;
        setIsSubmitClicked(true);
        setIsDataFetched(false);

        // Fetch the appointments
        await filterAppointmentsByDate(chosenDate);

        // Set showAppointments to true
        setShowAppointments(true);
    };

    //Authenticate
    if (load) {
        return (<div>Loading</div>)
    }


    // Render the component
    return (
        <div>
            <h1>Filter Appointments by Date</h1>

            <form onSubmit={handleSubmit}>
                <h2>
                    Enter Date:
                    <input
                        type="date" // Change to date type
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <button type="submit">Filter</button>
                </h2>
            </form>
            {message && <p>{message}</p>}
            {isDataFetched && showAppointments && appointments.map((appointment) => (
                <p key={appointment._id}>
                    <h2>Patient:{appointment.patient_username}</h2>
                    <p>Doctor: {appointment.doctor_username}</p>
                    <p>Date: {appointment.date}</p>
                    <p>Status: {appointment.status}</p>
                </p>
            ))}
        </div>
    );
};

export default AppointmentsByDateViewPatient;
/*import React, { useState, useEffect } from 'react';

const AppointmentsByStatusView = () => {

    const [Appointments, setAppointments] = useState([]);
    const [showAppointments, setShowAppointments] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const filterAppointmentsByStatus = async () => {
            const response = await fetch(`http://localhost:5000/patient/filterAppointmentsByStatusForPatient/filterByStatus?status=${status}`, {
                method: 'GET',
            });
            const Appointments = await response.json();

            if (response.ok) {
                setAppointments(Appointments);
            }
        };

        if (showAppointments) {
            filterAppointmentsByStatus();
        }
    }, [showAppointments, status]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setShowAppointments(true);

    };

    return (
        <div>
            <h1>Filter Appointments by Status</h1>

            <form onSubmit={handleSubmit}>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="canceled">Canceled</option>
                    <option value="reschedule">Reschedule</option>
                </select>

                <button type="submit">Filter</button>
            </form>

            {showAppointments &&

                Appointments.map((appoint) => (
                    <p key={appoint._id}>
                        <h2>Patient:{appoint.patient_username}</h2>
                        <p>Doctor: {appoint.doctor_username}</p>
                        <p>Date: {appoint.date}</p>
                        <p>Status: {appoint.status}</p>

                    </p>
                ))

            }

        </div>
    );

};

export default AppointmentsByStatusView;*/

/*const filterAppointmentsByStatus = async (chosenStatus) => {


        const response = axios.get('/patient/filterAppointmentsByStatusForPatient/filterByStatus?status=' + chosenStatus)
            .then((response) => {
                if (response.status === 200) {
                    return appointments;
                } else {
                    throw new Error('Error filtering appointments by status');
                }
            })
            .catch((error) => {
                throw new Error('Error filtering appointments by status');
            });

        const appointments = response.data;

    };*/





// THE LAST WORKING CODE 13/10/2023 12:10 AM 
/* import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentsByStatusView = () => {

// State variables
const [appointments, setAppointments] = useState([]);
const [showAppointments, setShowAppointments] = useState(false);
const [status, setStatus] = useState('');

// useEffect hook to fetch appointments when showAppointments is true
useEffect(() => {
    if (showAppointments) {
        filterAppointmentsByStatus(status);
    }
}, [showAppointments, status]);

// function to filter appointments by status
const filterAppointmentsByStatus = async (chosenStatus) => {
    const response = await axios.post('/patient/filterAppointmentsByStatusForPatient/filterByStatus', {
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            status: chosenStatus,
        },
    });

    if (response.status === 200) {
        setAppointments(response.data);
    } else {
        throw new Error('Error filtering appointments by status');
    }
};

// function to handle form submit
const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the chosen status from the state
    const chosenStatus = status;

    // Fetch the appointments
    await filterAppointmentsByStatus(chosenStatus);

    // Set showAppointments to true
    setShowAppointments(true);
};

// Render the component
return (
    <div>
        <h1>Filter Appointments by Status</h1>

        <form onSubmit={handleSubmit}>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
            >
                <option value="upcoming">Upcoming</option>
                <option value="completed">Completed</option>
                <option value="canceled">Canceled</option>
                <option value="reschedule">Reschedule</option>
            </select>

            <button type="submit">Filter</button>
        </form>

        {showAppointments && appointments.map((appointment) => (
            <p key={appointment._id}>
                <h2>Patient:{appointment.patient_username}</h2>
                <p>Doctor: {appointment.doctor_username}</p>
                <p>Date: {appointment.date}</p>
                <p>Status: {appointment.status}</p>
            </p>
        ))}
    </div>
);
};

export default AppointmentsByStatusView; */