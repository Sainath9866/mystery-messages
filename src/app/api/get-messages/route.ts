import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import { User as AuthUser } from "next-auth";
export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions)
        const _user: AuthUser = session?.user as AuthUser
        if (!session || !session?.user) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Not authenticated',
                },
                { status: 404 }
            );
        }
        const userId = _user._id
        const user = await User.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();

        if (!user || user.length === 0) {
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { messages: user[0].messages },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(error)
        return Response.json(
            {
                success: false,
                message: 'Unable to find user to update message acceptance status',
            },
            { status: 404 }
        );
    }
}