import { registerController } from "@/models/auth/auth.controller";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        const user = await registerController(req);
        console.log("user from route", user)
        if(!user) throw new Error('User not created');

        return NextResponse.json({
            message: "User created successfully",
            data: user,
            success: true
        })
    } catch (error:any) {
        
        return NextResponse.json({message: error.message, success: false}, {status: 500})
    }
}