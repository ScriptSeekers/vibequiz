import { NextResponse } from "next/server";
import { emailService } from "@/services/email.service";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const isValid = emailService.verifyCode(email, code);

    if (isValid) {
      return NextResponse.json({ success: true, message: "Email successfully verified" });
    } else {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Verification error:", err);
    return NextResponse.json({ error: err.message || "Failed to verify code" }, { status: 500 });
  }
}
