
import { serve } from "https://deno.fresh.dev/std@v9.6.1/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const KIMERA_API_KEY = "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { runId } = await req.json();

    if (!runId) {
      return new Response(
        JSON.stringify({ error: 'Run ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Make request to Kimera AI API
    const response = await fetch(`https://api.kimera.ai/v1/pipeline/run/${runId}`, {
      method: 'GET',
      headers: {
        'x-api-key': KIMERA_API_KEY
      }
    });

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
