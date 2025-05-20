import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { User as AuthUser } from "next-auth";
export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions)
        const user: AuthUser = session?.user
        if (!session || !session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Not authenticated',
                },
                { status: 404 }
            );
        }
        const userId = user._id
        const acceptMessages = await request.json()
        const updatedUser = await User.findByIdAndUpdate(userId,
            {
                isAcceptingMessages: acceptMessages,
            },
            {
                new: true
            }
        )
        if (!updatedUser) {
            // User not found
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                message: 'Successfully updated message acceptance status',
                updatedUser
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving message acceptance status ", error)
        return NextResponse.json(
            {
                success: false,
                message: 'Error retrieving message acceptance status',
            },
            { status: 500}
        );
    }
}

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions)
        const user: AuthUser = session?.user
        if (!session || !session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Not authenticated',
                },
                { status: 404 }
            );
        }
        const userId = user._id
        const foundUser = await User.findOne({userId})
        if (!foundUser) {
            // User not found
            return NextResponse.json(
                {
                    success: false,
                    message: 'Unable to find user ',
                },
                { status: 404 }
            );
        }
        return NextResponse.json(
            {
                success: true,
                message: 'Successfully retreived acceptance status',
                isAcceptinMessages : foundUser.isAcceptingMessages
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error retrieving message acceptance status ", error)
        return NextResponse.json(
            {
                success: false,
                message: 'Error retrieving message acceptance status',
            },
            { status: 500 }
        );
    }
}