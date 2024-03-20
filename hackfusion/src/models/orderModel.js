import mongoose from 'mongoose';
import Status from '../enums/orderStatusEnum'

const orderSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.ObjectId,
        ref:'users',
        required:[true,'please provide a username'],
    },
    vendorId:{
        type:mongoose.Schema.ObjectId,
        ref:'users',
        required:[true,'please provide a username'],
    },
    productId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    transporterId:{
        type:mongoose.Schema.ObjectId,
        ref:'users',
        default:null,
    },
    status:{
        type:String,
        enum:Status,
        required:true,
    },
    OTP:{
        type:Number,
        required:true,
    }

})

const Order = mongoose.models.orders || mongoose.model('orders',orderSchema);

export default Order;