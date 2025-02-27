
import BaseLayout from "@/components/layouts/BaseLayout";
import { Card } from "@/components/ui/card";
import { DotPattern } from "@/components/ui/dot-pattern";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Code, Database, Server, ChevronDown, ChevronUp, Image } from "lucide-react";
import { useState } from "react";

const API = () => {
  const [openSections, setOpenSections] = useState({
    documentation: false,
    pipeline: false,
    status: false,
    response: false,
    rateLimits: false,
    imageUrl: false
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
            
            {/* Image URL Control - Collapsible */}
            <Card className="p-4 bg-background/50 backdrop-blur">
              <button 
                onClick={() => toggleSection('imageUrl')}
                className="w-full flex items-center gap-3"
              >
                <div className="bg-primary/20 p-2 rounded-md">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold flex-1 text-left">Image URL Control</h3>
                {openSections.imageUrl ? 
                  <ChevronUp className="h-5 w-5 text-primary" /> : 
                  <ChevronDown className="h-5 w-5 text-primary" />
                }
              </button>
              
              {openSections.imageUrl && (
                <div className="mt-4 pl-10">
                  <div className="text-gray-300 space-y-4">
                    <h4 className="font-semibold text-white text-lg">Guide to Manipulating Image URLs for Optimal Display</h4>
                    <p>
                      This guide explains how to modify image URLs to control their display size, proportions, and other visual aspects. 
                      By adding parameters to image URLs, you can optimize images for your specific needs without requiring server-side image processing.
                    </p>
                    <p className="italic">Note: For best results, the original source image should be in a 1:1 ratio.</p>
                    
                    <h5 className="font-semibold text-white">Basic URL Structure</h5>
                    <p>Image transformation parameters are typically added to a URL in the following format:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://domain.com/cdn-cgi/image/[parameters]/[original-image-path]</code>
                    </div>
                    
                    <p>Example:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=1230,fit=cover/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg</code>
                    </div>
                    
                    <h5 className="font-semibold text-white">Common Parameters</h5>
                    <h6 className="font-semibold text-white">Width and Height</h6>
                    <p><strong>width</strong> - Specifies maximum width of the image in pixels. Behavior depends on the fit mode.</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">width=250</code>
                    </div>
                    
                    <p>You can also use:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">width=auto</code>
                    </div>
                    <p>This automatically serves the image in the most optimal width based on the browser and device (supported only by Chromium browsers).</p>
                    
                    <p><strong>height</strong> - Specifies maximum height of the image in pixels.</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">height=250</code>
                    </div>
                    
                    <p className="italic font-semibold">Best Practice: Image sizes should match the exact dimensions at which they are displayed on the page. For responsive images, use the HTML srcset element with appropriate width parameters.</p>
                    
                    <h5 className="font-semibold text-white">Fit Modes</h5>
                    <p>The fit parameter determines how the image is resized within the specified dimensions.</p>
                    
                    <p><strong>fit=scale-down</strong> - Similar to contain, but the image is never enlarged. If the image is larger than given width or height, it will be resized; otherwise, its original size will be kept.</p>
                    <p>Example:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=scale-down/https://example.com/original-image.jpg</code>
                    </div>
                    
                    <p><strong>fit=contain</strong> - Image will be resized (shrunk or enlarged) to be as large as possible within the given width or height while preserving the aspect ratio.</p>
                    <p>Example:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=contain/https://example.com/original-image.jpg</code>
                    </div>
                    
                    <p><strong>fit=cover</strong> - Resizes (shrinks or enlarges) to fill the entire area of width and height. If the image has a different aspect ratio, it will be cropped to fit.</p>
                    <p>Example:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=cover/https://example.com/original-image.jpg</code>
                    </div>
                    
                    <p><strong>fit=crop</strong> - Image will be shrunk and cropped to fit within the specified area. The image will not be enlarged. For smaller images, it behaves like scale-down; for larger images, it behaves like cover.</p>
                    <p>Example:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=crop/https://example.com/original-image.jpg</code>
                    </div>
                    
                    <p><strong>fit=pad</strong> - Resizes to the maximum size that fits within the given dimensions, then fills the remaining area with a background color (white by default).</p>
                    <p>Example:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=pad/https://example.com/original-image.jpg</code>
                    </div>
                    
                    <h5 className="font-semibold text-white">Gravity</h5>
                    <p>When cropping with fit=cover or fit=crop, the gravity parameter defines which part of the image should be preserved.</p>
                    
                    <p><strong>gravity=auto</strong> - Automatically selects focal point based on saliency detection.</p>
                    <p>Example:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=cover,gravity=auto/https://example.com/original-image.jpg</code>
                    </div>
                    
                    <p><strong>Directional gravity</strong> - You can specify a side (left, right, top, bottom) or precise coordinates.</p>
                    <p>Examples:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=cover,gravity=left/https://example.com/original-image.jpg</code>
                    </div>
                    
                    <p>Using coordinates (from 0.0 to 1.0):</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=cover,gravity=0.5x0.2/https://example.com/original-image.jpg</code>
                    </div>
                    <p className="italic">Note: The coordinates 0.5x0.2 preserve the area around a point at 20% of the height and center of the width.</p>
                    
                    <h5 className="font-semibold text-white">Practical Examples</h5>
                    <p><strong>Creating a Square Thumbnail</strong></p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=250,height=250,fit=cover,gravity=auto/https://example.com/original-image.jpg</code>
                    </div>
                    <p>This creates a 250×250 square thumbnail, automatically focusing on the most important part of the image.</p>
                    
                    <p><strong>Responsive Banner Image</strong></p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=1200,height=400,fit=cover,gravity=0.5x0.33/https://example.com/original-image.jpg</code>
                    </div>
                    <p>This creates a widescreen banner image (1200×400) that focuses on the top third of the image.</p>
                    
                    <p><strong>Product Image with Preserved Dimensions</strong></p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=600,fit=scale-down/https://example.com/original-image.jpg</code>
                    </div>
                    <p>This ensures a product image is no wider than 600px but preserves smaller images at their original size.</p>
                    
                    <p><strong>Profile Picture</strong></p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=150,height=150,fit=cover,gravity=auto/https://example.com/original-image.jpg</code>
                    </div>
                    <p>This creates a square profile picture that automatically focuses on faces or other important features.</p>
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
