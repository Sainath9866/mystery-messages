import mongoose from "mongoose";
type connectionObject = {
    isConnected?: number
}
const connection : connectionObject = {}


export async function dbConnect() {
    if(connection.isConnected) {
        console.log("Database already connected")
        return
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")
        console.log("Database connection successfull")
        connection.isConnected = db.connections[0].readyState
    } catch (error : any) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}