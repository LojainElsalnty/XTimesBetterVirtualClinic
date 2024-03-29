const mongoose = require('mongoose');

const DoctorSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    hourly_rate: {
        type: Number,
        required: true,
    },
    affiliation: {
        type: String,
        required: true,
    },
    educational_background: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true
    },

    nationalID: {
        name: String,
        path: String,
        contentType: String,
    },
    medicalLicense: {
        name: String,
        path: String,
        contentType: String,
    },
    medicalDegree: {
        name: String,
        path: String,
        contentType: String,
    },
    
    availableTimeSlots: {
        type: [Date],
        required: false,
    },
    
    walletAmount:{
        type: Number,
        default:0

    }, notifications: {
        type: [
            {
                type: {
                    type: String, //new, cancelled , rescheduled 
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        default: [],
    }
    
}, { timestamps: true });


const Doctor = mongoose.model('Doctor', DoctorSchema);
module.exports = Doctor;