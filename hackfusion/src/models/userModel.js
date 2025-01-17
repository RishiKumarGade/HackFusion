import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'please provide a username'],
    },
    email:{
        type:String,
        required:[true,'please provide a email'],
        unique:true,
    },
     password:{
        type:String,
        required:[true,'please provide a password'],
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isCustomer:{
        type:Boolean,
        default:true,
    },
    isVendor:{
        type:Boolean,
        default:false,
    },
    isTransporter:{
        type:Boolean,
        default:false,
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,


})

const User = mongoose.models.users || mongoose.model('users',userSchema);

export default User;
