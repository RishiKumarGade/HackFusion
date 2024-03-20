import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    storeId:{
        type:mongoose.Schema.ObjectId,
        ref:'stores',
        required:true,
    },
    productname:{
        type:String,
        required:[true,'please provide a username'],
    },
    description:{
        type:String,
        default:'',
    },
    category:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String,
        required:true,
    }

})

const Product = mongoose.models.products || mongoose.model('products',productSchema);

export default Product;