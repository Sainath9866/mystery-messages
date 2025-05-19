import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export default async function sendVerificationMail(
    email: string,
    username: string,
    otp: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verify your email',
            react: VerificationEmail({ username, otp })
        });
        return {
            success: true,
            message: "Email sent successfully"
        }
    } catch (emailError) {
        console.error("error sending verification email")
        return {
            success: false,
            message: "error sending email"
        }
    }
}
