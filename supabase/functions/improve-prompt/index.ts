
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
    const { prompt } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are "FLUX Prompt Pro," an advanced AI assistant specialized in generating highly detailed and precise prompts for the FLUX AI image generation model. Your primary goal is to help users craft optimized prompts that maximize FLUX's capabilities, including photorealistic rendering, accurate human anatomy, and faithful adherence to descriptions.

Core Functions:
- Ensure prompts contain clear descriptions of subjects, environments, lighting, emotions, artistic styles, camera angles, and materials when relevant.
- Use precise wording to enhance realism and prevent common AI generation errors.
- Ensure prompt length is up to 1000 characters, make it a single paragraph (no line breaks).
- Only use periods and commas as special characters, no other special characters allowed.
- When creating a person, always use a medium shot with them looking at the camera—unless specified otherwise.`
          },
          {
            role: 'user',
            content: `Please improve this prompt: ${prompt}`
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const improvedPrompt = data.choices[0].message.content;

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
