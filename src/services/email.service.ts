import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER || "aibasedstudyplanner@gmail.com";
const smtpPass = process.env.SMTP_PASSWORD || "dgfwmksjnzelvoza";
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = Number(process.env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false, // TLS
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// In-memory verification code store (email -> { code, expiresAt })
const verificationCodes: Record<string, { code: string; expiresAt: number }> = {};

export const emailService = {
  /**
   * Generates a 6-digit numeric verification code and sends it via Gmail SMTP
   */
  async sendVerificationEmail(toEmail: string, userName?: string): Promise<{ success: boolean; message: string }> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    verificationCodes[toEmail.toLowerCase()] = { code, expiresAt };

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <div style="background: linear-gradient(135deg, #7655E8 0%, #477CF4 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
          <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Vibe Quiz</h1>
          <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.9;">AI-Powered Assessment & Learning Platform</p>
        </div>
        <div style="padding: 32px 28px; color: #1e293b;">
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0; color: #0f172a;">Verify Your Email Address</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #475569;">
            Hello ${userName || "Learner"},<br/>
            Thank you for registering with Vibe Quiz. Please use the 6-digit verification code below to verify your account and activate your study workspace:
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <div style="display: inline-block; padding: 16px 36px; background: #f1f5f9; border: 2px dashed #7655E8; border-radius: 16px; font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #7655E8;">
              ${code}
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 10px;">Valid for 15 minutes. Never share this code with anyone.</p>
          </div>
          <p style="font-size: 13px; line-height: 1.5; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 20px; margin-bottom: 0;">
            If you did not request this verification, you can safely ignore this email.
          </p>
        </div>
        <div style="background: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
          &copy; ${new Date().getFullYear()} Vibe Quiz. Built for intelligent mastery.
        </div>
      </div>
    `;

    try {
      await transporter.sendMail({
        from: `"Vibe Quiz" <${smtpUser}>`,
        to: toEmail,
        subject: `${code} is your Vibe Quiz verification code`,
        html: htmlContent,
      });

      return { success: true, message: "Verification code sent to " + toEmail };
    } catch (err: any) {
      console.error("Failed to send verification email:", err);
      // Fallback: keep code in memory so dev test can still verify if network blocks
      return { success: false, message: err.message || "Failed to send email" };
    }
  },

  /**
   * Verifies the 6-digit code for a given email
   */
  verifyCode(email: string, code: string): boolean {
    const entry = verificationCodes[email.toLowerCase()];
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      delete verificationCodes[email.toLowerCase()];
      return false;
    }
    const isValid = entry.code.trim() === code.trim();
    if (isValid) {
      delete verificationCodes[email.toLowerCase()];
    }
    return isValid;
  },

  /**
   * Sends password reset link/code
   */
  async sendPasswordResetEmail(toEmail: string): Promise<boolean> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[toEmail.toLowerCase()] = { code, expiresAt: Date.now() + 15 * 60 * 1000 };

    try {
      await transporter.sendMail({
        from: `"Vibe Quiz Security" <${smtpUser}>`,
        to: toEmail,
        subject: `Reset your Vibe Quiz password (${code})`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #7655E8;">Reset Your Password</h2>
            <p>Use code <strong>${code}</strong> to reset your password. It expires in 15 minutes.</p>
          </div>
        `,
      });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Sends student quiz report card directly to their inbox
   */
  async sendQuizReportEmail(toEmail: string, quizTitle: string, scorePercent: number, grade: string): Promise<boolean> {
    try {
      await transporter.sendMail({
        from: `"Vibe Quiz Reports" <${smtpUser}>`,
        to: toEmail,
        subject: `Your Quiz Results: ${quizTitle} — Score: ${scorePercent}% (${grade})`,
        html: `
          <div style="font-family: sans-serif; max-width: 540px; padding: 28px; border: 1px solid #e2e8f0; border-radius: 16px; background: #ffffff;">
            <h2 style="color: #0f172a; margin-top: 0;">Assessment Completed!</h2>
            <p>Congratulations on completing your evaluation for <strong>${quizTitle}</strong>.</p>
            <div style="background: #f8fafc; padding: 18px; border-radius: 12px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #475569;">Score: <strong style="font-size: 20px; color: #7655E8;">${scorePercent}%</strong></p>
              <p style="margin: 6px 0 0; font-size: 14px; color: #475569;">Performance Grade: <strong>${grade}</strong></p>
            </div>
            <p style="font-size: 12px; color: #64748b;">Review full explanations and concept breakdowns on your dashboard.</p>
          </div>
        `,
      });
      return true;
    } catch (e) {
      console.warn("Could not email quiz report:", e);
      return false;
    }
  },
};
