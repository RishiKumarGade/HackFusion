

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

export async function GET(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const store = await Store.findOne({userId: userId})
        const products = await Product.find({storeId: store._id})
        const notifications = await Notification.find({userId: userId})
            const response = NextResponse.json({
                message:'sessions found',
                store:store,
                products:products,
                notifications:notifications
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
