

import { connect } from "@/dbConfig/dbConfig";
import checkSessionExistenceServerSide from "@/helpers/checkSessionExistenceServerSide";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { getTokensToken } from "@/helpers/getTokensToken";
import Login from "@/models/loginModel";
import User from "@/models/userModel";
import Cart from "@/models/cartModel";

import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const reqBody = await request.json();
        const {type,productId,quantity} = reqBody;
        
        const user = await User.findOne({_id:userId})
        if(user == null){
            return NextResponse.json({
                message:'user not found',
                success: false,
            })
        }
        const cart = await Cart.findOne({userId:userId})
        if(type == "ADD"){
            cart.items.forEach(item => {
                if(item.productId == productId){
                    item.quantity += quantity
                }
            });
        }
        else{
            cart.items.push({productId:productId, quantity:quantity})         
        }
        if(type == "DELETE"){

        }
        await cart.save()
            const response = NextResponse.json({
                message:'cart updated successfully',
                user: user,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
