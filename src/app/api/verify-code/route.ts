import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const { username, code } = await request.json();
        const user = await User.findOne({ username});
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            })
        }
        const isCodeValid = user.verifyCode == code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (!isCodeValid) {
            return NextResponse.json({
                success: false,
                message: "Invalid Code"
            })
        }
        else if (!isCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "code expired"
            })
        }
        user.isVerified = true
        await user.save()
        return NextResponse.json({
            success: true,
            message: "user verification successful"
        })
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({
            success: false,
            message: "error verifying the user"
        }, { status: 500 })
    }
}