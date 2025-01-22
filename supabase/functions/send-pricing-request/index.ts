import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PricingRequest {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  eventDate: string;
  additionalNotes?: string;
  selectedFeatures: {
    basePackage: string | null;
    guestCount: number;
    imageFeatures: string[];
    videoFeatures: string[];
    customPipelines: number;
  };
  totalPrice: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const pricingRequest: PricingRequest = await req.json();
    
    // Format features for email
    const formatFeatures = (features: string[]) => 
      features.length > 0 
        ? features.map(f => `• ${f}`).join('\n')
        : 'None selected';

    const expectedUsage = Math.round(pricingRequest.selectedFeatures.guestCount * 0.7);
    
    const emailHtml = `
      <h2>New Pricing Request</h2>
      
      <h3>Contact Information</h3>
      <p>
        <strong>Company:</strong> ${pricingRequest.companyName}<br>
        <strong>Contact Name:</strong> ${pricingRequest.contactName}<br>
        <strong>Email:</strong> ${pricingRequest.email}<br>
        <strong>Phone:</strong> ${pricingRequest.phone}<br>
        <strong>Event Date:</strong> ${pricingRequest.eventDate}
      </p>

      <h3>Package Details</h3>
      <p>
        <strong>Base Package:</strong> ${pricingRequest.selectedFeatures.basePackage || 'None selected'}<br>
        <strong>Total Guests:</strong> ${pricingRequest.selectedFeatures.guestCount}<br>
        <strong>Expected Usage (70%):</strong> ${expectedUsage} uses
      </p>

      <h3>Selected Features</h3>
      <h4>Image Features:</h4>
      <pre>${formatFeatures(pricingRequest.selectedFeatures.imageFeatures)}</pre>

      <h4>Video Features:</h4>
      <pre>${formatFeatures(pricingRequest.selectedFeatures.videoFeatures)}</pre>

      ${pricingRequest.selectedFeatures.customPipelines > 0 ? `
        <h4>Custom Pipelines:</h4>
        <p>Number of Custom Pipelines: ${pricingRequest.selectedFeatures.customPipelines}</p>
      ` : ''}

      <h3>Total Investment</h3>
      <p><strong>$${pricingRequest.totalPrice.toFixed(2)}</strong></p>

      ${pricingRequest.additionalNotes ? `
        <h3>Additional Notes</h3>
        <p>${pricingRequest.additionalNotes}</p>
      ` : ''}
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kimera Partners <partners@kimera.ai>",
        to: ["daniel@kimera.ai"],
        subject: `New Pricing Request from ${pricingRequest.companyName}`,
        html: emailHtml,
        reply_to: pricingRequest.email
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Email sent successfully:", data);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      const error = await res.text();
      console.error("Error sending email:", error);
      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error: any) {
    console.error("Error in send-pricing-request function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);