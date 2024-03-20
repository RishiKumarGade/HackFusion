

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Store from "@/models/storeModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const reqBody = await request.json();
        const {type,newStore} = reqBody;
        const user = await User.findOne({_id:userId})
        if(user == null ) {
            return NextResponse.json({
                message:'user not found',
                success: false,
            })
        }

        if(type == "CREATE"){
            await Store.create({
                userId: userId,
                storename:newStore.storename})
        }else{

        }
            return NextResponse.json({
                message:'Store updated successfully',
            })
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
