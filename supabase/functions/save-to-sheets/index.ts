import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AppointmentRequest {
  fullName: string;
  email: string;
  mobile: string;
  caseType: string;
  timeSlot: string;
  caseDetails: string;
  appointmentDate: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const appointmentData: AppointmentRequest = await req.json();
    console.log("Received appointment data:", appointmentData);
    console.log("Email from request:", appointmentData.email);
    console.log("Mobile from request:", appointmentData.mobile);

    // Generate a random booking ID
    const bookingId = `BK${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Get the Google Sheets webhook URL from environment
    const sheetsWebhookUrl = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");

    if (!sheetsWebhookUrl) {
      console.error("Google Sheets webhook URL not configured");
      return new Response(
        JSON.stringify({ 
          error: "Google Sheets integration not configured. Please contact support." 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Prepare data for Google Sheets
    const sheetData = {
      bookingId,
      appointmentDate: appointmentData.appointmentDate,
      fullName: appointmentData.fullName,
      email: appointmentData.email,
      mobile: appointmentData.mobile,
      caseType: appointmentData.caseType,
      timeSlot: appointmentData.timeSlot,
      disputeDetails: appointmentData.caseDetails,
    };

    console.log("Sending data to Google Sheets:", sheetData);
    console.log("Email being sent:", sheetData.email);
    console.log("Mobile being sent:", sheetData.mobile);

    // Send data to Google Sheets webhook
    const sheetsResponse = await fetch(sheetsWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sheetData),
    });

    if (!sheetsResponse.ok) {
      console.error("Google Sheets webhook error:", await sheetsResponse.text());
      throw new Error("Failed to save to Google Sheets");
    }

    console.log("Successfully saved to Google Sheets");

    return new Response(
      JSON.stringify({ 
        success: true, 
        bookingId,
        message: "Appointment data saved successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in save-to-sheets function:", error);
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
