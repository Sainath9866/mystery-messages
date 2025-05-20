import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import { Message } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect()
    try {
        const { username, content } = await request.json()
        const user = await User.findOne({ username })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "user not found"
            },
                { status: 404 }
            )
        }
        if (!user.isAcceptingMessages) {
            return NextResponse.json({
                success: false,
                message: "user not accepting messages"
            },
                { status: 404 }
            )
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage)
        await user.save()
        return NextResponse.json({
            success: true,
            message: "message sent successfully"
        },
            { status: 404 }
        )
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}