

import { connect } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import Product from "@/models/productModel";
import Store from "@/models/storeModel";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request:NextRequest) {
    try {
        const userId = await getDataFromToken(request)
        const reqBody = await request.json();
        const {type,name,description,price,imageurl,category} = reqBody;
        console.log(type,name,description,price,imageurl)
        const store = await Store.findOne({userId:userId})
        if(userId == null ) {
            return NextResponse.json({
                message:'user not found',
                success: false,
            })
        }

        if(type == "CREATE"){
            await Product.create({
                storeId: store._id,
                productname:name,
                description:description,price:price,imageUrl:imageurl,category:category
            }).catch(err =>console.log(err))
        }else{
            
        }
            return NextResponse.json({
                message:'Store updated successfully',
            })
        } catch (error:any) {
            return NextResponse.json({error: error.message })
        }
}
