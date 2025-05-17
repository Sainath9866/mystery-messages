import mongoose from "mongoose";
import { Schema ,Document} from "mongoose";

export interface Message extends Document {
    content : string
    createdAt : Date
}

const MessageSchema : Schema<Message> = new mongoose.Schema({
    content : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    }
})

export interface User extends Document{
    username : string
    email : string
    password : string
    isVerified : boolean
    verifyCode : string,
    verifyCodeExpiry : Date
    isAcceptingMessages : boolean
    messages : Message[]
}

const UserSchema : Schema<User> = new mongoose.Schema({
    username : {
        type : String,
        required : [true, "Username is required"],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true, "email is required"],
        unique : true,
        match : [/.+\@.+\..+/, "Please usea valid email address"]
    },
    password : {
        type : String,
        required : [true, "password is required"],
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    verifyCode : {
        type : String,
        required : [true, "Verify code is required"],
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true, "Verify code expiry is required"],
    },
    isAcceptingMessages : {
        type : Boolean,
        default : true
    },
    messages : [MessageSchema]
})

const User = mongoose.models.users || mongoose.model("User", UserSchema)

export default User;