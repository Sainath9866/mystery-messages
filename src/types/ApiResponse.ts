import { Message } from "@/models/User";
import VerificationEmail from "../../emails/VerificationEmail";
export interface ApiResponse {
    success: boolean
    message: string
    isAcceptingMessages?: boolean
    messages?: Array<Message>
}

