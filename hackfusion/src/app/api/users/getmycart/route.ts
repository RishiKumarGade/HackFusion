

import { connect } from "@/dbConfig/dbConfig";
import checkSessionExistenceServerSide from "@/helpers/checkSessionExistenceServerSide";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { getTokensToken } from "@/helpers/getTokensToken";
import Store from "@/models/storeModel";
import Notification from "@/models/notificationModel";
import Product from "@/models/productModel";
import Order from "@/models/orderModel";


import { NextRequest, NextResponse } from "next/server";
import Cart from "@/models/cartModel";

connect()

export async function GET(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const cart = await Cart.find({userId: userId})
            const response = NextResponse.json({
                message:'cart found',
                cart: cart
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}