import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { adminNotificationEmail, BRAND } from "@/lib/email-templates";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "maximiliangerhardtofficial@gmail.com";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/**
 * POST /api/admin/notify
 * Body: { event, details }
 * Sends admin notification email for key events.
 * No auth required — but only accepts known event types.
 */
export async function POST(req: NextRequest) {
  try {
    const { event, details } = await req.json();

    const validEvents = ["registration", "newsletter_confirmed", "newsletter_unsubscribed", "creator_application"];
    if (!event || !validEvents.includes(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const template = adminNotificationEmail(event, details || {});
    const resend = getResend();

    await resend.emails.send({
      from: BRAND.from,
      to: ADMIN_EMAIL,
      subject: template.subject,
      html: template.html,
    });

    return NextResponse.json({ status: "notified" });
  } catch (err) {
    console.error("Admin notify error:", err);
    return NextResponse.json({ error: "Notification failed" }, { status: 500 });
  }
}
