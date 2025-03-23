
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const KIMERA_API_KEY = "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee";
const PIPELINE_ID = "803a4MBY";
const VIDEO_PIPELINE_ID = "wkE3eiap"; // Updated video pipeline ID

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl, prompt, ratio = "2:3", loraScale = 0.5, style = "Cinematic", seed = -1, isVideo = false } = await req.json();

    if (!imageUrl || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Image URL and prompt are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select the appropriate pipeline ID
    const selectedPipelineId = isVideo ? VIDEO_PIPELINE_ID : PIPELINE_ID;

    // Create request body based on whether it's a video or image generation
    let requestBody;
    
    if (isVideo) {
      // For video, only send the required fields: pipeline_id, imageUrl, and prompt
      requestBody = {
        pipeline_id: VIDEO_PIPELINE_ID,
        imageUrl,
        prompt
      };
    } else {
      // For image, include all the additional parameters
      requestBody = {
        pipeline_id: PIPELINE_ID,
        imageUrl,
        ratio,
        prompt,
        data: {
          lora_scale: loraScale,
          style: style,
          seed: seed
        }
      };
    }

    console.log(`Making ${isVideo ? 'video' : 'image'} generation request with:`, JSON.stringify(requestBody));

    // Make request to Kimera AI API
    const response = await fetch('https://api.kimera.ai/v1/pipeline/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KIMERA_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    // Ensure pipeline_id is included in the response
    if (!data.pipeline_id) {
      data.pipeline_id = selectedPipelineId;
    }

    // Ensure seed is included in the response
    if (!data.seed && data.data?.seed !== undefined) {
      data.seed = String(data.data.seed);
    }

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in run-pipeline function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
