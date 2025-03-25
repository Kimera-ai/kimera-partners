
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const KIMERA_API_KEY = "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee";
const PIPELINE_ID = "803a4MBY";
const VIDEO_PIPELINE_ID = "1bPwBZEg"; // Updated video pipeline ID from wkE3eiap to 1bPwBZEg

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl, prompt, ratio = "2:3", loraScale = 0.5, style = "Cinematic", seed = -1, isVideo = false, workflow = "no-reference" } = await req.json();

    if (!imageUrl || !prompt) {
      return new Response(
        JSON.stringify({ error: 'Image URL and prompt are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert isVideo to a proper boolean to avoid string/boolean confusion
    const isVideoBoolean = isVideo === true || isVideo === 'true' || isVideo === 1;
    
    // Select the appropriate pipeline ID
    const selectedPipelineId = isVideoBoolean ? VIDEO_PIPELINE_ID : PIPELINE_ID;
    console.log(`Using pipeline: ${selectedPipelineId} for ${isVideoBoolean ? 'video' : 'image'} generation`);
    console.log(`Input workflow parameter: ${workflow}`);

    // Forcefully standardize workflow value to ensure consistent casing/format
    let standardizedWorkflow = workflow;
    if (typeof standardizedWorkflow === 'string') {
      standardizedWorkflow = standardizedWorkflow.toLowerCase().trim();
    }
    
    // Determine final workflow based on the inputs
    let finalWorkflow;
    if (isVideoBoolean) {
      // For videos, always use 'video' workflow
      finalWorkflow = 'video';
    } else if (standardizedWorkflow === 'with-reference') {
      // Face Gen mode
      finalWorkflow = 'with-reference';
    } else if (standardizedWorkflow === 'cartoon') {
      // Reference mode
      finalWorkflow = 'cartoon';
    } else {
      // Default to no-reference for normal image generation
      finalWorkflow = 'no-reference';
    }

    console.log(`Standardized input workflow: ${standardizedWorkflow}`);
    console.log(`Final workflow being used: ${finalWorkflow}`);

    // Make sure ratio is never "Default"
    const normalizedRatio = (ratio === "Default" || !ratio) ? "2:3" : ratio;
    console.log(`Using normalized ratio: ${normalizedRatio}`);

    // Generate a unique request ID to help with deduplication
    const requestId = crypto.randomUUID();
    console.log(`Generated unique request ID: ${requestId}`);

    // Create request body based on whether it's a video or image generation
    let requestBody;
    
    if (isVideoBoolean) {
      // For video, include the essential parameters
      requestBody = {
        pipeline_id: VIDEO_PIPELINE_ID,
        imageUrl,
        prompt,
        // Include normalized ratio for video too for consistency
        ratio: normalizedRatio,
        // Add workflow for videos as well
        data: {
          workflow: 'video', // Always set video workflow for videos
          request_id: requestId // Add unique request ID
        }
      };
    } else {
      // For image, include all the additional parameters
      requestBody = {
        pipeline_id: PIPELINE_ID,
        imageUrl,
        ratio: normalizedRatio,
        prompt,
        data: {
          lora_scale: loraScale,
          style: style,
          seed: seed,
          workflow: finalWorkflow, // Include the standardized workflow
          request_id: requestId // Add unique request ID
        }
      };
    }

    console.log(`Making ${isVideoBoolean ? 'video' : 'image'} generation request with:`, JSON.stringify(requestBody));

    // Make request to Kimera AI API
    const response = await fetch('https://api.kimera.ai/v1/pipeline/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': KIMERA_API_KEY
      },
      body: JSON.stringify(requestBody)
    });

    // Check if response is valid JSON
    let data;
    try {
      data = await response.json();
    } catch (e) {
      console.error('Failed to parse API response as JSON:', e);
      const rawText = await response.text();
      console.log('Raw response text:', rawText);
      return new Response(
        JSON.stringify({ error: 'Invalid response from API', rawResponse: rawText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log("API response:", JSON.stringify(data));

    // Ensure pipeline_id is included in the response
    if (!data.pipeline_id) {
      data.pipeline_id = selectedPipelineId;
    }

    // Ensure seed is included in the response
    if (!data.seed && data.data?.seed !== undefined) {
      data.seed = String(data.data.seed);
    }
    
    // Explicitly include isVideo in the response as a boolean
    data.isVideo = isVideoBoolean;
    
    // Explicitly include workflow in the response with the standardized value
    data.workflow = finalWorkflow;
    
    // Add the request ID to the response for tracking
    data.request_id = requestId;
    
    // Include the normalized ratio in the response
    data.ratio = normalizedRatio;
    
    console.log(`Final response with isVideo=${isVideoBoolean}, workflow=${finalWorkflow}, requestId=${requestId}, ratio=${normalizedRatio}:`, JSON.stringify(data));

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
