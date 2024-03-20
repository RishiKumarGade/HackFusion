import mongoose from 'mongoose';
import NotifyType from '../enums/notificationTypeEnum'


const notificationSchema = new mongoose.Schema({
    message:{
        type:String,
        required:true,
    },
    notifyType:{
        type:String,
        enum:NotifyType,
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'users',
    },
    orderId:{
        type:mongoose.Schema.ObjectId,
        ref:'orders',
    },
    timestamp: {
        type: Date,
        default: Date.now()
      },
})

const Notification = mongoose.models.notifications || mongoose.model('notifications',notificationSchema);

export default Notification;