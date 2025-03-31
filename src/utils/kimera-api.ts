
// Utility file for Kimera API integration

interface KimeraApiConfig {
  apiKey: string;
  pipelineId: string;
  imageUrl?: string;
  ratio?: string;
  prompt?: string;
  lora_scale?: number;
  style?: string;
  seed?: number;
}

// Submit job to Kimera pipeline
export const runPipeline = async (config: KimeraApiConfig) => {
  try {
    console.log('Starting Kimera pipeline:', config.pipelineId);
    
    const response = await fetch('https://api.kimera.ai/v1/pipeline/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': config.apiKey
      },
      body: JSON.stringify({
        pipeline_id: config.pipelineId,
        imageUrl: config.imageUrl, // Using imageUrl consistently
        ratio: config.ratio || '2:3',
        prompt: config.prompt,
        data: {
          lora_scale: config.lora_scale || 0.5,
          style: config.style || 'Cinematic',
          seed: config.seed || -1
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Kimera API error:', errorData);
      throw new Error(`Pipeline run failed: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Pipeline run submitted successfully, jobId:', data.id);
    return data;
  } catch (error) {
    console.error('Error running Kimera pipeline:', error);
    throw error;
  }
};

// Check job status from Kimera pipeline
export const checkPipelineStatus = async (jobId: string, apiKey: string) => {
  try {
    console.log('Checking Kimera pipeline status for job:', jobId);
    
    const response = await fetch(`https://api.kimera.ai/v1/pipeline/run/${jobId}`, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Kimera API status check error:', errorData);
      throw new Error(`Status check failed: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Pipeline status:', data.status);
    return data;
  } catch (error) {
    console.error('Error checking Kimera pipeline status:', error);
    throw error;
  }
};
