import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AppointmentRequest {
  fullName: string;
  email: string;
  mobile: string;
  caseType: string;
  caseDetails: string;
  appointmentDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if RESEND_API_KEY is set
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      throw new Error("Email service not configured. Please contact the administrator.");
    }

    const appointmentData: AppointmentRequest = await req.json();
    console.log("Received appointment request:", appointmentData);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #0a1a3c; border-bottom: 3px solid #d4af37; padding-bottom: 10px;">
          New Appointment Booking
        </h1>
        <p style="font-size: 16px; color: #333;">
          A new appointment has been booked with the following details:
        </p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Full Name</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.email}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Mobile</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.mobile}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Appointment Date</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.appointmentDate}</td>
          </tr>
          <tr style="background-color: #f5f5f5;">
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Case Type</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.caseType}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #ddd; font-weight: bold;">Case Details</td>
            <td style="padding: 12px; border: 1px solid #ddd;">${appointmentData.caseDetails}</td>
          </tr>
        </table>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This is an automated notification from the Advocate Rajkumar Saha website.
        </p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Advocate Rajkumar Saha <onboarding@resend.dev>",
        to: ["karamit819@gmail.com"],
        subject: `New Appointment Booking - ${appointmentData.fullName}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(emailData)}`);
    }

    console.log("Email sent successfully:", emailData);

    return new Response(
      JSON.stringify({ success: true, message: "Appointment email sent successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending appointment email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
