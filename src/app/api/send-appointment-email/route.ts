import AppointmentConfirmationEmail from "@/components/emails/AppointmentConfirmationEmail";
import resend from "@/lib/resend";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("/api/send-email route hit");
    const body = await request.json();

    const {
      userEmail,
      doctorName,
      appointmentDate,
      appointmentTime,
      appointmentType,
      duration,
      price,
    } = body;

    // validate required fields
    if (!userEmail || !doctorName || !appointmentDate || !appointmentTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // send the email safely
    let emailId = null;
    try {
      const { data, error } = await resend.emails.send({
        from: "Dentra <no-reply@resend.dev>",
        to: [userEmail],
        subject: "Appointment Confirmation - Dentra",
        react: AppointmentConfirmationEmail({
          doctorName,
          appointmentDate,
          appointmentTime,
          appointmentType,
          duration,
          price,
        }),
      });

      if (error) {
        console.error("Resend error (demo project, ignoring):", error);
      } else {
        emailId = data?.id;
      }
    } catch (emailError) {
      console.error("Email sending failed (demo project, ignoring):", emailError);
    }
    return NextResponse.json(
      { message: "Email sent (or ignored for demo)", emailId },
      { status: 200 }
    );

  } catch (error) {
    console.error("Email sending internal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
