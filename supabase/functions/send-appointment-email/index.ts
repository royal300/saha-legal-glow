import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY_NEW = "re_Mr8aNMAR_8z7fGfKYty9SCWhK1H2ci7DN";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface AppointmentRequest {
  fullName: string;
  email: string;
  mobile: string;
  caseType: string;
  caseDetails?: string;
  appointmentDate: string;
  timeSlot?: string;
}

const generateEmailHtml = (data: AppointmentRequest) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
    <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h1 style="color: #0a1a3c; text-align: center;">Appointment Confirmation</h1>
      <p style="color: #333;">Dear ${data.fullName},</p>
      <p style="color: #333;">Thank you for booking an appointment with Advocate Rajkumar Saha.</p>
      
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Appointment Details:</h3>
        <p><strong>Booking ID:</strong> APT-${Date.now().toString().slice(-6)}</p>
        <p><strong>Date:</strong> ${data.appointmentDate}</p>
        <p><strong>Time:</strong> ${data.timeSlot || 'To be confirmed'}</p>
        <p><strong>Case Type:</strong> ${data.caseType}</p>
      </div>

      <div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p style="color: #856404; margin: 0;"><strong>Important:</strong></p>
        <p style="color: #856404;">Your appointment is partially confirmed. To complete your booking, please make the payment using the link below:</p>
        <div style="text-align: center; margin-top: 15px;">
          <a href="https://payment.example.com" 
             style="background-color: #0a1a3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Complete Payment
          </a>
        </div>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 14px; margin: 0;">
          Best regards,<br>
          <strong>Advocate Rajkumar Saha</strong><br>
          Civil Court, Patna<br>
          Contact: +91 XXXXXXXXXX
        </p>
      </div>
    </div>
  </div>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  // Add CORS headers to all responses
  const headers = {
    ...corsHeaders,
    "Content-Type": "application/json"
  };

  try {
    let appointmentData: AppointmentRequest;
    try {
      const body = await req.text();
      console.log("Raw request body:", body);
      appointmentData = JSON.parse(body);
      console.log("Parsed appointment data:", appointmentData);
    } catch (e) {
      console.error("JSON parsing error:", e);
      throw new Error("Invalid JSON in request body. Please check the data format.");
    }
    
    // Validate required fields
    if (!appointmentData.email) throw new Error("Email is required");
    if (!appointmentData.fullName) throw new Error("Full name is required");
    if (!appointmentData.appointmentDate) throw new Error("Appointment date is required");
    if (!appointmentData.caseType) throw new Error("Case type is required");

    // Send email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY_NEW}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Advocate Rajkumar Saha <onboarding@resend.dev>",
        to: [appointmentData.email],
        subject: "Your Appointment Confirmation - Advocate Rajkumar Saha",
        html: generateEmailHtml(appointmentData)
      })
    });

    const responseData = await emailResponse.json();
    console.log("Resend API response:", responseData);

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${JSON.stringify(responseData)}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        id: responseData.id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error: any) {
    console.error("Function error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to send email"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
};

serve(handler);