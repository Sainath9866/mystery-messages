import { dbConnect } from "@/lib/dbConnect";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import sendVerificationMail from "@/helpers/sendVerificationEmail";

export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const { username, email, password } = await request.json()

        const existingVerifiedUserByUsername = await User.findOne({
            username,
            isVerified: true
        })
        if (existingVerifiedUserByUsername) {
            return NextResponse.json({
                success: true,
                error: "username already taken"
            })
        }
        const existingUser = await User.findOne({
            email,
        })
        let otp = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUser) {
            if (existingUser.isVerified) {
                return NextResponse.json({
                    success: true,
                    error: "user already exists"
                })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUser.password = hashedPassword;
                existingUser.verifyCode = otp
                existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUser.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const savedUser = await User.create({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifyCode: otp,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessages: true,
                messages: []
            })
            return NextResponse.json({
                success: true,
                error: "user registration successful",
                savedUser
            })
        }
        const emailResponse = await sendVerificationMail(username, email, otp)
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error registering the user", error)
        return NextResponse.json({
            success: false,
            error: "user registration failed"
        })
    }
}