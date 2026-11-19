import { NextResponse } from "next/server";
import { emailService } from "@/services/email.service";

export async function POST(req: Request) {
  try {
    const { email, fullName } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await emailService.sendVerificationEmail(email, fullName);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  } catch (err: any) {
    console.error("API error:", err);
    return NextResponse.json({ error: err.message || "Failed to process request" }, { status: 500 });
  }
}
