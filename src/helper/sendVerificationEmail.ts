import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { resend } from "@/lib/resend";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {

    try {
        const otp = verifyCode;
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification code for project',
            react: VerificationEmail({ username, otp }),
        });

        return { success: true, message: "email send successfully" }
    } catch (error) {
        return { success: true, message: "error while sending message" }
    }

}