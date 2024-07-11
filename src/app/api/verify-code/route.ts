import UserModel from "@/models/user.models";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { username, verifyCode } = await request.json();
        const query = {
            username,
            verifyCode,
            verifyCodeExpiry:{$gt:Date.now()}
    
        }
    
        const user = await UserModel.findOne(query);
        if( !user ){
               return Response.json({
                "message":'either username is not found || verifyCode is wrong || verifyCodeExpiry is wrong',
                'success':false
               },{
                status:500
               })
        }else{
            user.isVerified = true;
            await user.save();
            return Response.json({
                'message': 'congratulation user is verified',
                'success':true
            },{
                status:200
            })
        }
    } catch (error : any) {
        console.log(`we are having error while verify-code` error);
        return
        
    }

}