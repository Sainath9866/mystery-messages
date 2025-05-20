import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";
import  CredentialsProvider  from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before logging in")
                    }

                    const iscorrect = await bcrypt.compare(credentials.password, user.password)
                    if (iscorrect) {
                        return user
                    } else {
                        throw new Error("Incorrect passowrd")
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks : {
        async jwt({token, user})  {
            if(user) {
                token._id = user._id,
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingmessages
                token.username = user.username
            }
            return token
        },
        async session({session, token}){
            if(token) {
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages = token.isAcceptingMessages,
                session.user.username = token.username
            }
            return session;
        },
    },
    session : {
        strategy : 'jwt'
    },
    secret : process.env.NEXTAUTH_SECRET,
    pages : {
        signIn : '/sign-in'
    },
}
