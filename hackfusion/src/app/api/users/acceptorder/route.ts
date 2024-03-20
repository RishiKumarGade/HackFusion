

import { connect } from "@/dbConfig/dbConfig";
import checkSessionExistenceServerSide from "@/helpers/checkSessionExistenceServerSide";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { getTokensToken } from "@/helpers/getTokensToken";
import Store from "@/models/storeModel";
import Notification from "@/models/notificationModel";
import Product from "@/models/productModel";
import Order from "@/models/orderModel";

import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const reqBody = await request.json();
        const {orderId} = reqBody
        const order = await Order.findOne({ _id:orderId })
        order.transporterId = userId
        order.status ="WAITINGFORTRANSPORTER"

        await Notification.create({
            userId: order.customerId,
            message: ` your product is Accepted by transporter ${userId}`,
            orderId:orderId
    })
            await Notification.create({
                userId: order.vendorId,
                message: ` your product is Accepted by transporter ${userId}`,
                orderId:orderId
            })

        await order.save()
            const response = NextResponse.json({
                message:'success',
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
