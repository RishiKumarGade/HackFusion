

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Order from "@/models/orderModel";
import Notification from "@/models/notificationModel";



import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const reqBody = await request.json();
        const {orderId} = reqBody
        const order = await Order.findOne({ _id:orderId,transporterId:userId })

        await Notification.create({
                userId: order.customerId,
                message: ` your product is rejected by transporter ${userId}`,
                orderId:orderId
        })
        await Notification.create({
            userId: order.vendorId,
            message: ` your product is rejected by transporter ${userId}`,
            orderId:orderId
        })
        order.transporterId = null
        order.status ="WAITINGFORTRANSPORTER"
        await order.save()
            const response = NextResponse.json({
                message:'success',
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
