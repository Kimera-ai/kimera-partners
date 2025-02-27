
import BaseLayout from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Code, Database, Server } from "lucide-react";

const API = () => {
  return (
    <BaseLayout>
      <div className="relative min-h-screen bg-background">
        <div className="absolute inset-0 pointer-events-none">
          <DotPattern 
            width={24}
            height={24}
            className="[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
            cy={1}
            cr={1}
            cx={1}
          />
        </div>
        
        <div className="relative mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            API Documentation
          </h1>
          
          <Card className="p-6 mb-10 bg-background/50 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <div className="mb-6">
              <AspectRatio ratio={16/9} className="overflow-hidden rounded-lg bg-black">
                <video 
                  src="https://www.dropbox.com/scl/fi/i5i48nj1wrl6t8px3gnuc/Screen-Recording-2025-02-12-at-17.57.13.mov?rlkey=vykrbekocg3tm7bitte1pbbny&st=fwtfgjlj&dl=1" 
                  controls
                  className="w-full h-full object-contain"
                />
              </AspectRatio>
            </div>
            <p className="text-gray-300 mb-4">
              Watch the video above for a quick overview of how to use our API.
            </p>
          </Card>
          
          <Card className="p-6 mb-10 bg-background/50 backdrop-blur overflow-hidden">
            <h2 className="text-2xl font-semibold mb-4">Full API Documentation</h2>
            <div className="rounded-lg overflow-hidden bg-white">
              <iframe 
                src="https://api.kimera.ai/api-docs/" 
                className="w-full h-[600px] border-0"
                title="Kimera AI API Documentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </Card>
          
          <div className="grid gap-8 mb-10">
            <Card className="p-6 bg-background/50 backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Server className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Running a Pipeline</h3>
                  <p className="text-gray-300 mb-4">
                    Use our API to run image generation pipelines programmatically.
                  </p>
                  <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      <code>{`POST /v1/pipeline/run HTTP/1.1
Host: api.kimera.ai
x-api-key: 1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee
Content-Type: application/json
Content-Length: 145

{
  "pipeline_id": "803a4MBY",
  "imageUrl": "replace with uploaded image url",
  "ratio": "2:3",
  "prompt": "replace with prompt input",
  "data": {
    "lora_scale": 0.5,
    "style":"Cinematic",
    "seed": -1
  }
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/50 backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Checking Pipeline Status</h3>
                  <p className="text-gray-300 mb-4">
                    Monitor the status of your pipeline runs with the GET endpoint.
                  </p>
                  <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      <code>{`GET /v1/pipeline/run/replace with the response id from post response HTTP/1.1
Host: api.kimera.ai
x-api-key: 1712edc40e3eb72c858332fe7500bf33e885324f8c1cd52b8cded2cdfd724cee`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-background/50 backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Response Format</h3>
                  <p className="text-gray-300 mb-4">
                    Our API returns JSON responses with the following structure:
                  </p>
                  <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      <code>{`{
  "id": "pipeline-run-id",
  "status": "completed", // pending, processing, completed, failed
  "output": {
    "image_url": "https://example.com/output-image.jpg"
  },
  "created_at": "2023-01-01T00:00:00Z"
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-6 mb-10 bg-background/50 backdrop-blur">
            <h2 className="text-2xl font-semibold mb-4">Rate Limits</h2>
            <p className="text-gray-300">
              Your account is subject to the following rate limits:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2 text-gray-300">
              <li>100 API requests per minute</li>
              <li>1,000 API requests per hour</li>
              <li>10,000 API requests per day</li>
            </ul>
            <p className="mt-4 text-gray-300">
              Exceeding these limits will result in a 429 Too Many Requests response.
            </p>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default API;
