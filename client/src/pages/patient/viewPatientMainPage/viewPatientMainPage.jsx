import React, { useEffect, useState } from 'react';

// Axios
import axios from 'axios';

// Styles
import styles from './viewPatientMainPage.module.css'

// React Router Dom Components
import { Routes, Route, Navigate } from 'react-router-dom';

// React Router Dom Hooks
import { useNavigate } from 'react-router-dom';

// User Defined Hooks
import { useAuth, useUsername } from '../../../components/hooks/useAuth';

// Side Bar
import { ResponsiveSideBar } from '../../../components/responsiveSideBar/responsiveSideBar';

// Pages
import ViewAllDrs from '../ViewAllDrs/ViewAllDrs';
import ViewDoctorsList from '../ViewDoctorListPage/ViewDoctorListPage'
import ViewDoctorInfo from '../ViewDoctorInfoPage/ViewDoctorInfoPage';
import PrescriptionTable from '../viewPrescriptionInfoPage/PrescriptionTable';
import FamilyView from '../PatientHome/PatientHome';
import AddFamilyMember from '../AddFamilyMember/AddFamilyMember';
import AppointmentsByStatusViewPatient from '../FilterAppointmentsForPatientByStatus/FilterAppointmentsForPatientByStatus';
import AppointmentsByDateViewPatient from '../FilterAppointmentsForPatientByDate/FilterAppointmentsForPatientByDate';
import { PatientProfile } from '../PatientProfile/PatientProfile';
import LinkPatientWithAnotherByEmail from '../LinkPatientWithAnother/LinkPatientWithAnotherByEmail';
import LinkPatientWithAnotherByMobile from '../LinkPatientWithAnother/LinkPatientWithAnotherByMobile';
import PackagesDetails from '../ViewPackagesDetails/ViewPackagesDetails';
import SubsDetails from '../UnsubscribePackage/UnsubscribePackage';
import Appointments from '../ViewAppointmentsPage/ViewAppointmentsPage'
import BookAppointment from '../BookingFormPage/BookingFormPage'
import AppointmentPayment from '../payments/appointmentPaymentPage'
import PackagePayment from '../payments/packagePaymentPage'
import { SuccessPayment, SuccessPackagePayment } from '../payments/successPaymentPage'
import UnsuccessPayment from '../payments/unsuccessfulPaymentPage'
import ViewMedicalHistory from '../viewMedicalHistory/viewMedicalHistory';
import ViewPatientWalletPage from '../viewWallet/viewPatientWalletPage';
import ViewHealthRecords from '../ViewHealthRecordsPage/viewhealthRecordsPage';
import { ChatPage } from '../ChatPage/chatPage'; 
import RequestFollowUp from '../RequestFollowUp/RequestFollowUp';
import VideoCall from '../PVideoCall/PVideoCall';
import Call from '../VideoCalling/VideoCalling';
import RescheduleTimeSlots from '../rescheduleTimeSlots/rescheduleTimeSlots';
import PatientNotifications from '../viewNotifications/viewNotifications';

// Components
import { Navbar } from '../../../components/navBar/navBar';
import { ResponsiveAppBar } from '../../../components/responsiveNavBar/responsiveNavBar';




export const ViewPatientMainPage = () => {
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


    const list = [
        {
            url: "/patient/viewDoctorsListPage",
            pageName: "Doctors",
        },
        {
            url: "/patient/prescriptionTable",
            pageName: "Prescriptions",
        },
        {
            url: "/patient/ViewPackagesDetails",
            pageName: "Packages",
        },
        {
            url: "/patient/ViewAppointments",
            pageName: "Appointments"
        },
    ];

    if (  accessToken=== null ||accessToken=== undefined || accessToken.split(' ')[1] === "") return (<Navigate to="/login" />);
    // if (  accessToken.split(' ')[1] === "") return (<Navigate to="/login" />);
    if (load) {
        return (<div>Loading</div>)
    }
    return (
        <div className={styles['main-div']}>
            {/* <Navbar name="Patient" list={list} /> */}
            <ResponsiveAppBar array={list}/>
            <ResponsiveSideBar array={list} />
            <>
                <Routes>
                    <Route path='/ViewAllDrs' element={<ViewAllDrs />} />
                    <Route path='/viewDoctorsListPage' element={< ViewDoctorsList />} />
                    <Route path='/viewDoctorInfoPage' element={< ViewDoctorInfo />} ></Route>
                    <Route path="/prescriptionTable" element={<PrescriptionTable />} />
                    <Route path="/FamilyInformation" element={<FamilyView />} />
                    <Route path="/AddFamily" element={<AddFamilyMember />} />
                    <Route path="/FilterAppointmentByStatusPatient" element={<AppointmentsByStatusViewPatient />} />
                    <Route path="/FilterAppointmentByDatePatient" element={<AppointmentsByDateViewPatient />} />
                    <Route path="/profile" element={<PatientProfile />} />
                    <Route path="/LinkPatientWithAnotherByEmail" element={<LinkPatientWithAnotherByEmail />} />
                    <Route path="/LinkPatientWithAnotherByMobile" element={<LinkPatientWithAnotherByMobile />} />
                    <Route path='/ViewPackagesDetails' element={<PackagesDetails />} />
                    <Route path='/ViewSubscribedPackages' element={<SubsDetails />} />
                    <Route path="/viewWalletNumber" element={<ViewPatientWalletPage />} />
                    <Route path="/ViewAppointments" element={<Appointments />} />
                    <Route path="/BookAppointment" element={<BookAppointment />} />
                    <Route path="/appointmentPayment" element={<AppointmentPayment />} />
                    <Route path="/packagePayment" element={<PackagePayment />} />
                    <Route path="/successPayment" element={<SuccessPayment />} />
                    <Route path="/successPackagePay" element={<SuccessPackagePayment />} />
                    <Route path="/unsuccessPayment" element={<UnsuccessPayment />} />
                    <Route path="/viewMedicalHistory" element={<ViewMedicalHistory />} />
                    <Route path="/viewHealthRecords" element={<ViewHealthRecords />} />
                    <Route path="/ChatPage" element={<ChatPage />} />
                    <Route path="/RequestFollowUp" element={<RequestFollowUp />} />
                    <Route path="/VideoCall" element={<VideoCall/>} />
                    <Route path="/Call" element={<Call/>} />
                    <Route path="/rescheduleTimeSlots" element={<RescheduleTimeSlots/>} />
                    <Route path="/viewNotifications" element={<PatientNotifications />} />
                    <Route path="/" element={<Navigate to="/patient/viewDoctorsListPage" />} />
                </Routes>
            </>
        </div>
    )
}