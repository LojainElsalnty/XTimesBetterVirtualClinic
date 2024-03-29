const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const mongoose = require('mongoose');
const cors = require('cors');
var bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminRoutes = require('./routes/Admin/adminRoute.js');
const doctorRoutes = require('./routes/doctor/timeSlotsRoute.js');
const prescriptionRoutes = require('./routes/patient/prescriptions');
const prescriptionDoctorRoutes = require('./routes/doctor/prescriptionsDr');

const doctorListRoutes = require('./routes/patient/doctorListRoutes');
const multer = require('multer');
const path = require('path');
const updatePrescriptions = require('./routes/doctor/updatePrescriptionRoute.js')
const Server = require('socket.io').Server;
const roomModel = require('./models/Room');

mongoose.set('strictQuery', false);


// Express app
const app = express();

//Socket io (Salma Sprint 3)
//----------------------------------------------
//const http = require('http');
//const socketIo = require('socket.io');
//const server = http.createServer(app);
//const io = socketIo(server);

// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "http://localhost:5173",
// 		methods: [ "GET", "POST" ]
// 	}
// })

// io.on("connection", (socket) => {
// 	socket.emit("me", socket.id)

// 	socket.on("disconnect", () => {
// 		socket.broadcast.emit("callEnded")
// 	})

// 	socket.on("callUser", (data) => {
// 		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
// 	})

// 	socket.on("answerCall", (data) => {
// 		io.to(data.to).emit("callAccepted", data.signal)
// 	})
// })

//------------------------------------------------------

// App variables
const Port = process.env.PORT || 5000;
const MongoURI = process.env.MONGO_URI;

const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}

// Middleware
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

// Increase payload size limit (e.g., 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors(corsOptions))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(__dirname + '/uploads'));


// Middleware for allowing react to fetch() from server
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, OPTIONS');
  next();
});


// Connect to MongoDB
mongoose.connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!")

    const allowedOrigins = ['http://localhost:5173'];

    // Set up CORS options.
    const corsOptions = {
      origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    };

    // Enable CORS for all routes or specify it for specific routes.
    app.use(cors(corsOptions));

    // Starting server
    const expressServer = app.listen(Port, () => {
      console.log(`Listening to requests on http://localhost:${Port}`);
    });

    const socketIO = new Server(expressServer, {
      cors: {
        origin: '*',
        credentials: true,            //access-control-allow-credentials:true
        optionSuccessStatus: 200,
      }
    });

    socketIO.on('connection', (socket) => {
      console.log(`⚡: ${socket.id} user just connected!`);

      socket.on('room', async data => {
        console.log(data);
        const temp = data.room.split('!@!@2@!@!').reverse().join('!@!@2@!@!');
        console.log(`Temp: ${temp}`);
        const reverseRoom = await roomModel.find({ room_id: temp });
        console.log(reverseRoom);
        if (reverseRoom.length != 0) {
          socket.join(temp)
          console.log('joined room', temp)
          //socket.emit('joined',{room:temp})
          // Emit message to all users in the room
          socket.to(temp).emit('message', { name: data.name, text: data.text });
        } else {
          data.room.split('!@!@2@!@!').reverse().join('!@!@2@!@!');
          console.log(`Data Room: ${data.room}`);
          const room = await roomModel.find({ room_id: data.room });
          console.log(room);
          if (room.length != 0) {
            socket.join(data.room)
            console.log('joined room', data.room)
            //socket.emit('joined', { room: data.room})
            console.log(room);
            // Emit message to all users in the room
            socket.to(data.room).emit('message', { name: data.name, text: data.text });
          }
          else {
            socket.join(data.room);
            await roomModel.create({ room_id: data.room });
            console.log('joined room', data.room);
            //socket.emit('joined', { room: data.room });
            console.log(room);
            // Emit message to all users in the room
            socket.to(data.room).emit('message', { name: data.name, text: data.text });
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
      });
    })
  })
  .catch(err => console.log(err));

// -- Routes -- //
// LogIn
app.use('/login', require('./routes/login/loginRoute'));

// LogOut
app.use('/logout', require('./routes/login/logoutRoute'));

// Authentication
app.use('/authentication/checkAccessToken', require('./routes/authentication/checkAuthenticationRoute'));
app.use('/authentication/getAccessToken', require('./routes/authentication/getAccessTokenRoute'));
app.use('/authentication/changePassword', require('./routes/authentication/changePasswordRoute')); // update password of a user

// Reset Password
app.use('/resetPassword', require('./routes/authentication/resetPasswordRoute.js'));

// Doctor
app.use('/doctor/register', require('./routes/doctor/registerRoute'));
app.use('/doctor/patients', require('./routes/doctor/patientsRoute'));
app.use('/doctor/profile', require('./routes/doctor/profileRoute'));
app.use('/doctor/filterAppointmentsByDateForDoctor', require('./routes/doctor/filterAppointmentsRoute'));
app.use('/doctor/filterAppointmentsByStatusForDoctor', require('./routes/doctor/filterAppointmentsRoute'));
app.use('/doctor/info', require('./routes/doctor/doctorInfoRoute')); // Get information about logged in doctor using his/her username
app.use('/doctor/viewContract', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/addContract', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/viewDoctors', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/acceptContract', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/rejectContract', require('./routes/doctor/viewContractRoute'));
app.use('/doctor/viewWalletNumber', require('./routes/doctor/viewMyWallet'));
app.use('/doctor/appointments', require('./routes/doctor/appointmentsRoute.js'))
app.use('/doctor/addTimeSlot', doctorRoutes);
app.use('/doctor/uploadHealthRecords', require('./routes/doctor/healthRecordRoute'));
app.use('/doctor/viewPHealthRecords', require('./routes/doctor/viewHealthRoute'));
app.use('/doctor/prescriptionDetails', prescriptionDoctorRoutes);
app.use('/doctor/updatePrescriptions', require('./routes/doctor/updatePrescriptionRoute'));

//sprint3 ~Nour
app.use('/doctor/newPrescription', require('./routes/doctor/newPrescriptionRoute'));
app.use('/doctor/chat', require('./routes/doctor/chatRoute.js'));
app.use('/doctor/acceptRejectFollowUp', require('./routes/doctor/acceptRejectFollowUpRoute'));
app.use('/doctor/notifications', require('./routes/doctor/viewNotificationsRoute.js'));

// Admin
app.use('/admin/viewREQDoctors', require('./routes/admin/viewRequestedDoctorsInfo'));
app.use('/admin/removeDoctor', require('./routes/admin/viewRequestedDoctorsInfo'));
app.use('/admin/addPackage', require('./routes/admin/packageRoute'));
app.use('/admin/updatePackage', require('./routes/admin/packageRoute'));
app.use('/admin/deletePackage', require('./routes/admin/packageRoute'));
app.use('/admin/ViewPackage', require('./routes/admin/packageRoute'));
app.use('/Admin/addremove', adminRoutes);
app.use('/admin/info', require('./routes/admin/adminInfoRoute')); // Get information about logged in admin using his/her username

// Patient
app.use('/patient/allDoctors', require('./routes/patient/doctorsRoute'));
app.use('/patient/doctorList', doctorListRoutes)
app.use('/patient/register', require('./routes/patient/registerRoute'));
app.use('/patient/appointment', require('./routes/patient/appointmentRoute'));
app.use('/patient/prescriptionDetails', prescriptionRoutes);
app.use('/patient/addFamilyMember', require('./routes/patient/addFamilyMemberRoute'));
app.use('/patient/viewFamilyMembers', require('./routes/patient/viewFamilyMembersRoute'));
app.use('/patient/viewAppointments', require('./routes/patient/filterAppointmentsRoute'));
app.use('/patient/filterAppointmentsByDateForPatient', require('./routes/patient/filterAppointmentsRoute'));
app.use('/patient/filterAppointmentsByStatusForPatient', require('./routes/patient/filterAppointmentsRoute'));
app.use('/patient/info', require('./routes/patient/patientInfoRoute')); // Get information about logged in patient using his/her username
app.use('/patient/linkByEmail', require('./routes/patient/linkPatientWithAnotherRoute'));
app.use('/patient/linkByMobile', require('./routes/patient/linkPatientWithAnotherRoute'));
app.use('/patient/ViewPackages', require('./routes/patient/packagesRoute'));
app.use('/patient/ViewFamily', require('./routes/patient/packagesRoute'));
app.use('/patient/Subscribe', require('./routes/patient/packagesRoute'));
app.use('/patient/Unsubscribe', require('./routes/patient/packagesRoute'));
app.use('/patient/Famsubs', require('./routes/patient/packagesRoute'));
app.use('/patient/Allsubs', require('./routes/patient/packagesRoute'));
app.use('/patient/Allpatients', require('./routes/patient/packagesRoute'));
app.use('/patient/Subs1', require('./routes/patient/packagesRoute'));
app.use('/patient/Subs2', require('./routes/patient/packagesRoute'));
app.use('/patient/viewWalletNumber', require('./routes/patient/viewWallet'));
app.use('/patient/packagePaymentCreditCard', require('./routes/patient/payments/packageCreditCardPayment.js'));
app.use('/patient/packagePaymentWallet', require('./routes/patient/payments/packageWalletPayment.js'));
app.use('/patient/appointmentPaymentCreditCard', require('./routes/patient/payments/appointmentCreditCard.js'));
app.use('/patient/appointmentPaymentWallet', require('./routes/patient/payments/appointmentWallet.js'));
app.use('/patient/viewMedicalHistory', require('./routes/patient/medicalHistoryRoute'));
app.use('/patient/viewHealthRecords', require('./routes/patient/viewHealthRecordsRoute'));
app.use('/patient/chat', require('./routes/patient/chatRoute.js'));
app.use('/patient/requestFollowUp', require('./routes/patient/requestFollowUpRoute'));
app.use('/patient/notifications', require('./routes/patient/viewNotificationsRoute.js'));





//Salma Sprint 3
app.use('/patient/Video', require('./routes/patient/PvideoCallRoute'));
app.use('/doctor/Video', require('./routes/doctor/DvideoCallRoute'));
app.use('/patient/google', require('./routes/patient/GoogleAuthRoute'));

