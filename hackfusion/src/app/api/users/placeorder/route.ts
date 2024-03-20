

import { connect } from "@/dbConfig/dbConfig";
import checkSessionExistenceServerSide from "@/helpers/checkSessionExistenceServerSide";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { getTokensToken } from "@/helpers/getTokensToken";
import Login from "@/models/loginModel";
import Notification from "@/models/notificationModel";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const reqBody =await request.json();
        const {productId,quantity} = reqBody;
        const product = await Product.findOne({_id: productId}).populate('storeId')
        const otp = generateRandom6DigitNumber()
        await Order.create({
            vendorId:product.storeId.userId,
            customerId:userId,
            productId:productId,
            quantity:quantity,
            status:"WAITINGFORTRANSPORTER",
            OTP:otp,
        }).then(async (or)=>{
            await Notification.create({
                userId: product.storeId.userId,
                message: ` your product is ordered by ${userId}`,
                orderId:or._id
            })
        })
            const response = NextResponse.json({
                message:'sessions found',
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
function generateRandom6DigitNumber() {
  return Math.floor(Math.random() * 900000) + 100000;
}