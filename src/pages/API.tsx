
import BaseLayout from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Code, Database, Server, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const API = () => {
  const [openSections, setOpenSections] = useState({
    documentation: false,
    pipeline: false,
    status: false,
    response: false,
    rateLimits: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
          
          {/* Getting Started Video - Not Collapsible */}
          <Card className="p-6 mb-6 bg-background/50 backdrop-blur">
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
          
          {/* Full API Documentation - Collapsible */}
          <Card className="p-4 mb-4 bg-background/50 backdrop-blur">
            <button 
              onClick={() => toggleSection('documentation')}
              className="w-full flex justify-between items-center text-left"
            >
              <h2 className="text-xl font-semibold">Full API Documentation</h2>
              {openSections.documentation ? 
                <ChevronUp className="h-5 w-5 text-primary" /> : 
                <ChevronDown className="h-5 w-5 text-primary" />
              }
            </button>
            
            {openSections.documentation && (
              <div className="mt-4 rounded-lg overflow-hidden bg-white">
                <iframe 
                  src="https://api.kimera.ai/api-docs/" 
                  className="w-full h-[600px] border-0"
                  title="Kimera AI API Documentation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </Card>
          
          <div className="grid gap-4 mb-6">
            {/* Running a Pipeline - Collapsible */}
            <Card className="p-4 bg-background/50 backdrop-blur">
              <button 
                onClick={() => toggleSection('pipeline')}
                className="w-full flex items-center gap-3"
              >
                <div className="bg-primary/20 p-2 rounded-md">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold flex-1 text-left">Running a Pipeline</h3>
                {openSections.pipeline ? 
                  <ChevronUp className="h-5 w-5 text-primary" /> : 
                  <ChevronDown className="h-5 w-5 text-primary" />
                }
              </button>
              
              {openSections.pipeline && (
                <div className="mt-4 pl-10">
                  <p className="text-gray-300 mb-4">
                    Use our API to run image generation pipelines programmatically.
                  </p>
                  <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                    <pre className="text-sm text-gray-300 text-left">
                      <code>{`POST /v1/pipeline/run HTTP/1.1
Host: api.kimera.ai
x-api-key: YOUR_API_KEY
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
              )}
            </Card>
            
            {/* Checking Pipeline Status - Collapsible */}
            <Card className="p-4 bg-background/50 backdrop-blur">
              <button 
                onClick={() => toggleSection('status')}
                className="w-full flex items-center gap-3"
              >
                <div className="bg-primary/20 p-2 rounded-md">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold flex-1 text-left">Checking Pipeline Status</h3>
                {openSections.status ? 
                  <ChevronUp className="h-5 w-5 text-primary" /> : 
                  <ChevronDown className="h-5 w-5 text-primary" />
                }
              </button>
              
              {openSections.status && (
                <div className="mt-4 pl-10">
                  <p className="text-gray-300 mb-4">
                    Monitor the status of your pipeline runs with the GET endpoint.
                  </p>
                  <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                    <pre className="text-sm text-gray-300 text-left">
                      <code>{`GET /v1/pipeline/run/replace with the response id from post response HTTP/1.1
Host: api.kimera.ai
x-api-key: YOUR_API_KEY`}</code>
                    </pre>
                  </div>
                </div>
              )}
            </Card>
            
            {/* Response Format - Collapsible */}
            <Card className="p-4 bg-background/50 backdrop-blur">
              <button 
                onClick={() => toggleSection('response')}
                className="w-full flex items-center gap-3"
              >
                <div className="bg-primary/20 p-2 rounded-md">
                  <Code className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold flex-1 text-left">Response Format</h3>
                {openSections.response ? 
                  <ChevronUp className="h-5 w-5 text-primary" /> : 
                  <ChevronDown className="h-5 w-5 text-primary" />
                }
              </button>
              
              {openSections.response && (
                <div className="mt-4 pl-10">
                  <p className="text-gray-300 mb-4">
                    Our API returns JSON responses with the following structure:
                  </p>
                  <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                    <pre className="text-sm text-gray-300 text-left">
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
              )}
            </Card>
          </div>
          
          {/* Rate Limits - Collapsible */}
          <Card className="p-4 mb-6 bg-background/50 backdrop-blur">
            <button 
              onClick={() => toggleSection('rateLimits')}
              className="w-full flex justify-between items-center text-left"
            >
              <h2 className="text-xl font-semibold">Rate Limits</h2>
              {openSections.rateLimits ? 
                <ChevronUp className="h-5 w-5 text-primary" /> : 
                <ChevronDown className="h-5 w-5 text-primary" />
              }
            </button>
            
            {openSections.rateLimits && (
              <div className="mt-4">
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
              </div>
            )}
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default API;
