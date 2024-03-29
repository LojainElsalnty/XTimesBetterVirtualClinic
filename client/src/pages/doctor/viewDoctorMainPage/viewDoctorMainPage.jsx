import React, { useEffect, useState } from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './viewDoctorMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// React Router Dom Hooks
import { useNavigate } from 'react-router-dom';

// Hooks
import { useAuth } from '../../../components/hooks/useAuth';

// Side Bar
import { ResponsiveSideBar } from '../../../components/responsiveSideBar/responsiveSideBar';

// Pages
import { ViewPatientInfo } from '../viewPatientInfoPage/viewPatientInfoPage';
import { ViewPatients } from '../viewPatientsPage/viewPatientsPage';
import UpdateDoctorInfo from '../doctorInfoPage/updateDoctorInfo';
import AppointmentsByStatusViewDoctor from '../FilterAppointmentsForDoctorByStatus/FilterAppointmentsForDoctorByStatus';
import AppointmentsByDateViewDoctor from '../viewFilterAppointmentsForDoctorByDate/FilterAppointmentsForDoctorByDate';
import { DoctorProfile } from '../DoctorProfile/DoctorProfile';
import ContractView from '../viewContractPage/ViewContract';
import ViewWalletPage from '../viewWalletPage/viewDoctorWalletPage';
import ViewAppointments from '../viewAppointmentsPage/viewAppointmentsPage';
import ScheduleFollowUp from '../scheduleFollowUpPage/scheduleFollowUpPage';
import TimeSlots from '../timeSlotsPage/timeSlots';
import UploadHealthRecords from '../uploadHealthRecordsPage/uploadHealthRecords';
import ViewPHealthRecords from '../viewHealthPage/viewHealthPage';
import { ChatPage } from '../ChatPage/chatPage';
import AcceptRejectFollowUp from '../AcceptRejectFollowUpPage/AcceptRejectFollowUpPage';

//Sprint3
import PatientVisitLog from '../newPrescriptionPages/patientVisitLogPage';
import AddMedsToPrescription from '../newPrescriptionPages/addMedsToPrescriptionPage';
import FinalizePrescription from '../newPrescriptionPages/finalizePrescriptionPage';

import PrescriptionDoctorTable from '../viewPrescriptionInfoDoctorPage/PrescriptionDoctorTable';
// import UpdatePrescriptionPage from '../viewPrescriptionInfoDoctorPage/UpdatePrescriptionPage';
//salma sprint 3
import DoctorVideo from '../DVideoCall/DVideoCall';
import RescheduleTimeSlots from '../rescheduleTimeSlotsDoc/rescheduleTimeSlotsDoc'
import DoctorNotifications from '../viewNotifications/viewNotifications';

// Components
import { Navbar } from '../../../components/navBar/navBar';
import { ResponsiveAppBar } from '../../../components/responsiveNavBar/responsiveNavBar';

// import UpdatePrescriptionPage from '../viewPrescriptionInfoDoctorPage/UpdatePrescriptionPage';

import UpdatePrescription from '../updatePrescription/updatePrescription';


export const ViewDoctorMainPage = () => {
    // const {accessToken, refreshToken} = useAuth();
    const navigate = useNavigate();

    //Authenticate part
    const accessToken = sessionStorage.getItem('accessToken');
    const [load, setLoad] = useState(true);
    const [username, setUsername] = useState('');

    console.log(accessToken);
    useEffect(() => {
        if (username.length != 0) {
            setLoad(false);
        }
    }, [username]);

    if (accessToken === undefined || accessToken === null || accessToken === "Bearer  " || accessToken === "" || accessToken === " " || accessToken.split(' ')[1] === "") return (<Navigate to="/login" />);

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

    const list = [
        {
            url: "/doctor/viewPatientsPage",
            pageName: "Patients",
        },
        {
            url: "/doctor/viewAppointmentsPage",
            pageName: "Appointments",
        },
        {
            url: "/doctor/writePrescription",
            pageName: "Write Prescription",
        },
        {
            url: "/doctor/PrescriptionDoctorTable",
            pageName: "Prescriptions",
        },
        {
            url: "/doctor/AcceptRejectFollowUpPage",
            pageName: "Follow Up",
        },
    ];

    if (load) {
        return (<div>Loading</div>)
    }
    return (
        <div className={styles['main-div']}>
            {/* <Navbar name="Doctor" list={list} /> */}
            <ResponsiveAppBar array={list}/>
            <ResponsiveSideBar array={list} />
            <>
                <Routes>
                    <Route path='/viewPatientsPage' element={<ViewPatients />} />
                    <Route path='/viewPatientInfoPage' element={<ViewPatientInfo />} ></Route>
                    <Route path="/updateInfoPage" element={<UpdateDoctorInfo />} ></Route>
                    <Route path="/FilterAppointmentByStatusDoctor" element={<AppointmentsByStatusViewDoctor />} />
                    <Route path="/FilterAppointmentByDateDoctor" element={<AppointmentsByDateViewDoctor />} />
                    <Route path="/profile" element={<DoctorProfile />} />
                    <Route path="/viewContract" element={<ContractView />} />
                    <Route path="/viewWalletNumber" element={<ViewWalletPage />} />
                    <Route path="/viewAppointmentsPage" element={<ViewAppointments />} />
                    <Route path="/scheduleFollowUpPage" element={<ScheduleFollowUp />} />
                    <Route path="/addTimeSlot" element={<TimeSlots />} />
                    <Route path="/uploadHealthRecords" element={<UploadHealthRecords />} />
                    <Route path="/viewHealthPage" element={<ViewPHealthRecords />} />
                    <Route path="/writePrescription" element={<PatientVisitLog />} />
                    <Route path="/addMedsToPrescription" element={<AddMedsToPrescription />} />
                    <Route path="/finalizePrescription" element={<FinalizePrescription />} />
                    <Route path="/PrescriptionDoctorTable" element={<PrescriptionDoctorTable />} />
                    {/* <Route path="/doctor/update-prescription/:id" element={<updatePresciption />} /> */}
                    <Route path="/UpdatePrescription/:prescriptionId" element={<UpdatePrescription />} />
                    <Route path="/ChatPage" element={<ChatPage />} />
                    <Route path="/AcceptRejectFollowUpPage" element={<AcceptRejectFollowUp />} />
                    <Route path="/VideoCall" element={<DoctorVideo />} />
                    <Route path='/rescheduleTimeSlots' element={<RescheduleTimeSlots/>} />
                    <Route path="/viewNotifications" element={<DoctorNotifications />} />
                    <Route path="/" element={<Navigate to="/doctor/viewPatientsPage" />} />
                </Routes>
            </>
        </div >
    )
}