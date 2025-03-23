
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, workflow, imageUrl } = await req.json();

    // Define system prompts based on workflow type
    let systemPrompt = '';
    
    if (workflow === 'video') {
      systemPrompt = `You are "Kimera Video Prompt Pro," an advanced AI assistant specialized in generating highly detailed and precise prompts for the Kimera AI video generation model.

Your primary goal is to help users craft cinematic prompts that will produce engaging and visually compelling videos. Focus on adding:

- Dynamic movement descriptions (like camera movements, subject motion)
- Cinematic terminology (establishing shots, panning, zooming, etc.)
- Emotional tone and atmosphere descriptions
- Visual continuity elements
- Lighting and color palette suggestions
- Scene setting and environment details

Ensure prompt length is up to 1000 characters, make it a single paragraph (no line breaks).
Only use periods and commas as special characters, no other special characters allowed.
Transform basic scene descriptions into rich cinematic directions that will produce captivating videos.`;
    } else {
      systemPrompt = `You are "FLUX Prompt Pro," an advanced AI assistant specialized in generating highly detailed and precise prompts for the FLUX AI image generation model. Your primary goal is to help users craft optimized prompts that maximize FLUX's capabilities, including photorealistic rendering, accurate human anatomy, and faithful adherence to descriptions.

Core Functions:
- Ensure prompts contain clear descriptions of subjects, environments, lighting, emotions, artistic styles, camera angles, and materials when relevant.
- Use precise wording to enhance realism and prevent common AI generation errors.
- Ensure prompt length is up to 1000 characters, make it a single paragraph (no line breaks).
- Only use periods and commas as special characters, no other special characters allowed.
- When creating a person, always use a medium shot with them looking at the camera—unless specified otherwise.`;
    }

    // Create messages array for API call
    let messages = [];
    
    if (workflow === 'video' && imageUrl) {
      console.log("Processing video workflow with image:", imageUrl);
      
      messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            {
              type: "text",
              text: prompt ? `Please create a cinematic video prompt based on this image and initial prompt: ${prompt}` : "Please create a cinematic video prompt based on this image:"
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ];
    } else {
      messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Please improve this prompt: ${prompt}`
        }
      ];
    }

    console.log("Sending to OpenAI with messages:", JSON.stringify(messages));

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: workflow === 'video' && imageUrl ? 'gpt-4o' : 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      throw new Error(data.error?.message || "Error from OpenAI API");
    }
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected response format from OpenAI API");
    }
    
    const improvedPrompt = data.choices[0].message.content;
    console.log("Generated improved prompt:", improvedPrompt);

    return new Response(JSON.stringify({ improvedPrompt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
