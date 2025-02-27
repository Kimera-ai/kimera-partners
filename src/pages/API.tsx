
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
                    
                    {/* Original Example Image */}
                    <div className="flex flex-col items-center my-6">
                      <h5 className="font-semibold text-white mb-4">Original Example Image</h5>
                      <img 
                        src="https://www.jeann.online/cdn-cgi/image/width=800,height=1230,fit=cover/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                        alt="Example image" 
                        className="max-w-[400px] rounded-lg"
                      />
                    </div>
                    
                    <div className="bg-background/40 border-l-4 border-primary/50 p-4 rounded-r-lg">
                      <strong>Note:</strong> For best results, the original source image should be in a 1:1 ratio.
                    </div>
                    
                    <h5 className="font-semibold text-white">Basic URL Structure</h5>
                    <p>Image transformation parameters are typically added to a URL in the following format:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://domain.com/cdn-cgi/image/[parameters]/[original-image-path]</code>
                    </div>
                    
                    <p>Example:</p>
                    <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full">
                      <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=1230,fit=cover/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg</code>
                    </div>
                    
                    <h5 className="font-semibold text-white mt-6">Common Parameters</h5>
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
                    
                    <h5 className="font-semibold text-white mt-6">Fit Modes Comparison</h5>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse my-4">
                        <thead>
                          <tr>
                            <th className="border border-white/10 bg-background/40 p-2 text-left">Fit Mode</th>
                            <th className="border border-white/10 bg-background/40 p-2 text-left">Description</th>
                            <th className="border border-white/10 bg-background/40 p-2 text-left">Example (400x300)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-white/10 p-2"><code>scale-down</code></td>
                            <td className="border border-white/10 p-2">Similar to <code>contain</code>, but the image is never enlarged. If the image is larger than given dimensions, it will be resized; otherwise, its original size will be kept.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=scale-down/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="scale-down example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 p-2"><code>contain</code></td>
                            <td className="border border-white/10 p-2">Image will be resized to be as large as possible within the given dimensions while preserving the aspect ratio.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=contain/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="contain example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 p-2"><code>cover</code></td>
                            <td className="border border-white/10 p-2">Resizes to fill the entire area. If the image has a different aspect ratio, it will be cropped to fit.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=cover/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="cover example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 p-2"><code>crop</code></td>
                            <td className="border border-white/10 p-2">Image will be shrunk and cropped to fit. The image will not be enlarged.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=crop/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="crop example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 p-2"><code>pad</code></td>
                            <td className="border border-white/10 p-2">Resizes to fit and fills remaining area with a background color.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=pad/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="pad example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <h5 className="font-semibold text-white mt-6">Gravity Comparison</h5>
                    <p>When cropping with <code>fit=cover</code> or <code>fit=crop</code>, the <code>gravity</code> parameter defines which part of the image should be preserved.</p>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse my-4">
                        <thead>
                          <tr>
                            <th className="border border-white/10 bg-background/40 p-2 text-left">Gravity</th>
                            <th className="border border-white/10 bg-background/40 p-2 text-left">Description</th>
                            <th className="border border-white/10 bg-background/40 p-2 text-left">Example (400x300)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-white/10 p-2"><code>auto</code></td>
                            <td className="border border-white/10 p-2">Automatically selects focal point based on saliency detection.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=cover,gravity=auto/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="gravity auto example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 p-2"><code>left</code></td>
                            <td className="border border-white/10 p-2">Preserves the left side of the image when cropping.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=cover,gravity=left/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="gravity left example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 p-2"><code>right</code></td>
                            <td className="border border-white/10 p-2">Preserves the right side of the image when cropping.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=cover,gravity=right/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="gravity right example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 p-2"><code>top</code></td>
                            <td className="border border-white/10 p-2">Preserves the top of the image when cropping.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=cover,gravity=top/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="gravity top example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-white/10 p-2"><code>0.5x0.2</code></td>
                            <td className="border border-white/10 p-2">Preserves the area around a point at 20% from the top and centered horizontally.</td>
                            <td className="border border-white/10 p-2">
                              <img 
                                src="https://www.jeann.online/cdn-cgi/image/width=400,height=300,fit=cover,gravity=0.5x0.2/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                                alt="gravity coordinates example" 
                                className="max-w-full rounded-lg"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <h5 className="font-semibold text-white mt-6">Practical Examples</h5>
                    
                    <div className="bg-background/40 rounded-lg p-4 my-4">
                      <h6 className="font-semibold text-white">Square Thumbnail (250×250):</h6>
                      <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full mt-2">
                        <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=250,height=250,fit=cover,gravity=auto/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg</code>
                      </div>
                      <div className="mt-3 flex justify-center">
                        <img 
                          src="https://www.jeann.online/cdn-cgi/image/width=250,height=250,fit=cover,gravity=auto/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                          alt="Square thumbnail example" 
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-background/40 rounded-lg p-4 my-4">
                      <h6 className="font-semibold text-white">Widescreen Banner (800×300):</h6>
                      <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full mt-2">
                        <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=800,height=300,fit=cover,gravity=0.5x0.33/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg</code>
                      </div>
                      <div className="mt-3">
                        <img 
                          src="https://www.jeann.online/cdn-cgi/image/width=800,height=300,fit=cover,gravity=0.5x0.33/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                          alt="Banner image example" 
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-background/40 rounded-lg p-4 my-4">
                      <h6 className="font-semibold text-white">Product Image (max width 400px):</h6>
                      <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full mt-2">
                        <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=400,fit=scale-down/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg</code>
                      </div>
                      <div className="mt-3 flex justify-center">
                        <img 
                          src="https://www.jeann.online/cdn-cgi/image/width=400,fit=scale-down/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                          alt="Product image example" 
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-background/40 rounded-lg p-4 my-4">
                      <h6 className="font-semibold text-white">Profile Picture (150×150):</h6>
                      <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full mt-2">
                        <code className="text-sm">https://www.jeann.online/cdn-cgi/image/width=150,height=150,fit=cover,gravity=auto/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg</code>
                      </div>
                      <div className="mt-3 flex justify-center">
                        <img 
                          src="https://www.jeann.online/cdn-cgi/image/width=150,height=150,fit=cover,gravity=auto/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" 
                          alt="Profile picture example" 
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <h5 className="font-semibold text-white mt-6">How to Use These URLs</h5>
                    <p>You can use these transformed image URLs in various ways:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>As the <code>src</code> attribute in an <code>&lt;img&gt;</code> tag</li>
                      <li>As the background image in CSS with <code>background-image: url(...)</code></li>
                      <li>In responsive image solutions with <code>&lt;picture&gt;</code> or <code>srcset</code> attributes</li>
                    </ul>

                    <div className="bg-background/40 rounded-lg p-4 my-4">
                      <h6 className="font-semibold text-white">Example HTML usage:</h6>
                      <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full mt-2">
                        <pre><code>&lt;img src="https://www.jeann.online/cdn-cgi/image/width=800,height=600,fit=cover/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg" alt="Example image" /&gt;</code></pre>
                      </div>
                    </div>

                    <div className="bg-background/40 rounded-lg p-4 my-4">
                      <h6 className="font-semibold text-white">Example CSS usage:</h6>
                      <div className="bg-gray-900 p-3 rounded-lg overflow-x-auto w-full mt-2">
                        <pre><code>.header-background {
  background-image: url('https://www.jeann.online/cdn-cgi/image/width=1200,height=400,fit=cover/https://kimera-media.s3.eu-north-1.amazonaws.com/ff34d313-dda8-4d84-bbb7-369c087f057f_event/ff34d313-dda8-4d84-bbb7-369c087f057f_result.jpg');
  background-size: cover;
  background-position: center;
}</code></pre>
                      </div>
                    </div>
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
