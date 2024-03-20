import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true,
    },
    storename:{
        type:String,
        required:[true,'please provide a name'],
    },
    description:{
        type:String,
        default:'',
    },
})

const Store = mongoose.models.stores || mongoose.model('stores',storeSchema);

export default Store;