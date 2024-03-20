

import { connect } from "@/dbConfig/dbConfig";
import checkSessionExistenceServerSide from "@/helpers/checkSessionExistenceServerSide";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { getTokensToken } from "@/helpers/getTokensToken";
import Store from "@/models/storeModel";
import Product from "@/models/productModel";
import Order from "@/models/orderModel";


import { NextRequest, NextResponse } from "next/server";

connect()

export async function GET(request:NextRequest) {
    try {
        const products = await Product.find()
            const response = NextResponse.json({
                message:'sessions found',
                products:products,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
