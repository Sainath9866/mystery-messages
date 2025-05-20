import { dbConnect } from "@/lib/dbConnect";
import { usernameValidation } from "@/schemas/signupSchema";
import User from "@/models/User";
import { z } from "zod"
import { NextRequest, NextResponse } from "next/server";

const usernameValidationcheck = z.object({
    username: usernameValidation
})
export async function GET(request: NextRequest) {
    await dbConnect()
    try {
        const { searchParams } = new URL(request.url)
        const result = usernameValidationcheck.safeParse({ username: searchParams.get('username') })
        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid Username"
            })
        }
        const {username} = result.data
        const existingUser = await User.findOne({
            username,
            isVerified : true
        })
        if(existingUser) {
            return NextResponse.json({
                success : false,
                message: "Username already taken"
            })
        }
        return NextResponse.json({
            success : true,
            message : "username is available"
        })
    } catch (error: any) {
        console.error("Error checking the username");
        return NextResponse.json({
            success: false,
            message: "error checking the username"
        })
    }
}