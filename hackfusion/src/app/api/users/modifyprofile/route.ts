

import { connect } from "@/dbConfig/dbConfig";
import checkSessionExistenceServerSide from "@/helpers/checkSessionExistenceServerSide";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { getTokensToken } from "@/helpers/getTokensToken";
import Login from "@/models/loginModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const reqBody = await request.json();
        const {type} = reqBody;
        
        const user = await User.findOne({_id:userId})
        if(user == null){
            return NextResponse.json({
                message:'user not found',
                success: false,
            })
        }
        if(type == "VENDOR"){
            user.isVendor = true
            
        }
        if(type == "TRANSPORTER"){
            user.isTransporter = true
        }
        await user.save()
            const response = NextResponse.json({
                message:'profile updated successfully',
                user: user,
            })
            return response
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
