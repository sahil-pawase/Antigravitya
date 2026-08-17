export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ success: boolean; id?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey && apiKey.startsWith("re_")) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Career Transformer <admissions@careertransformer.in>",
          to,
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error("Resend API error:", err);
        return { success: false };
      }

      const data = await response.json();
      return { success: true, id: data.id };
    } catch (error) {
      console.error("Error sending email via Resend:", error);
      return { success: false };
    }
  }

  // Development / fallback logger
  console.log("📨 [DEVELOPMENT EMAIL DISPATCHED]");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log("Preview:", html.substring(0, 150) + "...");
  return { success: true, id: `dev_mock_${Date.now()}` };
}

export function generateEnrollmentEmail(studentName: string, courseTitle: string, amountPaid: number) {
  return `
    <div style="font-family: Arial, sans-serif; background-color: #06101D; color: #F5F8FC; padding: 40px; border-radius: 8px;">
      <div style="max-width: 600px; margin: 0 auto; background: #081827; border: 1px solid #162942; border-radius: 12px; padding: 32px;">
        <h1 style="color: #41D8FF; margin-top: 0;">Welcome to Career Transformer!</h1>
        <p style="font-size: 16px; line-height: 1.6; color: #F5F8FC;">Hi <strong>${studentName}</strong>,</p>
        <p style="font-size: 16px; line-height: 1.6; color: #94A3B8;">
          Congratulations on taking the first step towards transforming your career. Your enrollment in <strong>${courseTitle}</strong> has been successfully confirmed.
        </p>
        <div style="background: #0C1A2B; border-left: 4px solid #397CFF; padding: 16px; margin: 24px 0; border-radius: 4px;">
          <p style="margin: 0; color: #94A3B8; font-size: 14px;">Program Enrolled: <strong style="color: #FFFFFF;">${courseTitle}</strong></p>
          <p style="margin: 8px 0 0 0; color: #94A3B8; font-size: 14px;">Amount Received: <strong style="color: #10B981;">₹${amountPaid.toLocaleString("en-IN")}</strong></p>
          <p style="margin: 8px 0 0 0; color: #94A3B8; font-size: 14px;">Access Status: <strong style="color: #41D8FF;">Instant Lifetime Access</strong></p>
        </div>
        <p style="font-size: 16px; line-height: 1.6; color: #94A3B8;">
          Your student dashboard is ready with all modules, projects, datasets, and mentor sessions.
        </p>
        <div style="margin: 32px 0; text-align: center;">
          <a href="http://localhost:3000/dashboard" style="background: #397CFF; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Access Student Dashboard →
          </a>
        </div>
        <hr style="border: 0; border-top: 1px solid #162942; margin: 32px 0;" />
        <p style="font-size: 12px; color: #64748B; text-align: center;">
          Career Transformer • Transform Your Skills. Build Your Career.<br />
          If you have questions, reply to this email or chat with academic support.
        </p>
      </div>
    </div>
  `;
}
