import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const KIMERA_API_KEY = "1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee";
const PIPELINE_ID = "803a4MBY";
const FACE_GEN_PIPELINE_ID = "FYpcEIUj"; // Face Gen specific pipeline ID
const IDEOGRAM_PIPELINE_ID = "iuR2hxvi"; // Added Ideogram specific pipeline ID
const VIDEO_PIPELINE_ID = "1bPwBZEg"; // Video pipeline ID

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageUrl, prompt, ratio = "2:3", loraScale = 0.5, style = "Cinematic", seed = -1, isVideo = false, workflow = "no-reference" } = await req.json();

    if (!imageUrl && workflow !== 'ideogram' && workflow !== 'no-reference') {
      return new Response(
        JSON.stringify({ error: 'Image URL is required for this workflow' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!prompt && workflow !== 'video') {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Convert isVideo to a proper boolean to avoid string/boolean confusion
    const isVideoBoolean = isVideo === true || isVideo === 'true' || isVideo === 1;
    
    // Standardize workflow value to ensure consistent casing/format
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
    } else if (standardizedWorkflow === 'ideogram') {
      // Ideogram mode
      finalWorkflow = 'ideogram';
    } else {
      // Default to no-reference for normal image generation
      finalWorkflow = 'no-reference';
    }

    console.log(`Standardized input workflow: ${standardizedWorkflow}`);
    console.log(`Final workflow being used: ${finalWorkflow}`);

    // Generate a unique request ID to help with deduplication
    const requestId = crypto.randomUUID();
    console.log(`Generated unique request ID: ${requestId}`);

    // Select the appropriate pipeline ID based on workflow
    let selectedPipelineId;
    if (isVideoBoolean) {
      selectedPipelineId = VIDEO_PIPELINE_ID;
    } else if (finalWorkflow === 'with-reference') {
      selectedPipelineId = FACE_GEN_PIPELINE_ID;
    } else if (finalWorkflow === 'ideogram') {
      selectedPipelineId = IDEOGRAM_PIPELINE_ID;
    } else {
      selectedPipelineId = PIPELINE_ID;
    }
    
    console.log(`Using pipeline: ${selectedPipelineId} for ${isVideoBoolean ? 'video' : 
                                                               finalWorkflow === 'with-reference' ? 'face gen' : 
                                                               finalWorkflow === 'ideogram' ? 'ideogram' : 'image'} generation`);

    // The correct default image URL for Ideogram - IMPORTANT: THIS MUST BE USED FOR IDEOGRAM
    const defaultIdeogramImageUrl = "https://www.jeann.online/cdn-cgi/image/format=png/https://kimera-media.s3.eu-north-1.amazonaws.com/ec9f7b54-7339-4faf-90ba-f12f54cbe3da/v2_JkeUSRWiMl_source.png";
    
    // Default image URL for other workflows
    const defaultImageUrl = "https://www.jeann.online/cdn-cgi/image/format=jpeg/https://kimera-media.s3.eu-north-1.amazonaws.com/623b36fe-ac7f-4c56-a124-cddb942a38e5_event/623b36fe-ac7f-4c56-a124-cddb942a38e5_source.jpeg";
    
    // Determine the effective image URL based on the workflow
    let effectiveImageUrl;
    
    if (finalWorkflow === 'ideogram') {
      // For ideogram, ALWAYS use the default ideogram image unless a custom image is explicitly provided
      if (!imageUrl) {
        effectiveImageUrl = defaultIdeogramImageUrl;
        console.log(`Using default Ideogram image URL: ${effectiveImageUrl}`);
      } else {
        // Keep the user provided image for ideogram if it exists
        effectiveImageUrl = imageUrl;
        console.log(`Using custom image for Ideogram: ${effectiveImageUrl}`);
      }
    } else if (imageUrl) {
      // For other workflows with a provided image
      effectiveImageUrl = imageUrl;
    } else {
      // Default image for workflows that don't need an image
      effectiveImageUrl = defaultImageUrl;
    }

    // Create request body based on whether it's a video or image generation
    let requestBody;
    
    if (isVideoBoolean) {
      // For video, use the new API format with inputs
      requestBody = {
        pipeline_id: VIDEO_PIPELINE_ID,
        inputs: {
          genText: prompt,
          yourImage: effectiveImageUrl
        }
      };
    } else {
      // For image, include all the additional parameters
      requestBody = {
        pipeline_id: selectedPipelineId, // Use the selected pipeline ID
        imageUrl: effectiveImageUrl, // IMPORTANT: Use imageUrl, not image
        ratio,
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

    console.log(`Making ${isVideoBoolean ? 'video' : 
                          finalWorkflow === 'with-reference' ? 'face gen' : 
                          finalWorkflow === 'ideogram' ? 'ideogram' : 'image'} generation request with:`, JSON.stringify(requestBody));

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
    
    console.log(`Final response with isVideo=${isVideoBoolean}, workflow=${finalWorkflow}, requestId=${requestId}:`, JSON.stringify(data));

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
