import { VisualAsset, Template, CaseStudy, Video } from "@/types/marketing";

export const visualAssets: VisualAsset[] = [
  {
    id: 1,
    type: 'image',
    category: 'Product Screenshots',
    title: 'AI Photobooth Interface',
    description: 'High-resolution screenshot of the Kimera AI photobooth interface',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    downloadUrl: '/sample-files/product-screenshot-1.jpg',
    dimensions: '2400x1600px',
    fileSize: '2.4 MB',
    tags: ['interface', 'product', 'photobooth']
  },
  {
    id: 2,
    type: 'image',
    category: 'Event Photos',
    title: 'Live Event Example',
    description: 'Kimera AI photobooth in action at a corporate event',
    thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
    downloadUrl: '/sample-files/event-photo-1.jpg',
    dimensions: '2400x1600px',
    fileSize: '3.1 MB',
    tags: ['event', 'live', 'corporate']
  },
  {
    id: 3,
    type: 'logo',
    category: 'Brand Assets',
    title: 'Kimera AI Logo Pack',
    description: 'Complete logo package including all variations and formats',
    thumbnail: 'https://images.unsplash.com/photo-1557683311-eac922347aa1',
    downloadUrl: '/sample-files/kimera-logos.zip',
    dimensions: 'Various',
    fileSize: '8.7 MB',
    tags: ['logo', 'brand', 'identity']
  }
];

export const templates: Template[] = [
  {
    id: 2,
    type: 'presentation',
    title: 'Pitch Deck Template',
    description: 'Professional presentation template for client meetings',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
    downloadUrl: '#',
    format: 'PPTX',
    fileSize: '8.2 MB'
  }
];

export const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "Transforming Engagement with Paybox Young",
    description: "PayBox launched their innovative \"PayBox Young\" app through an engaging event in Tel Aviv, partnering with Kimera AI to create an interactive AI photobooth experience that transformed adults into their younger selves",
    main_image_path: "Collage2.jpg",
    pdf_path: "Transforming-Engagement-with-Paybox-Young-An-AI-Powered-Event-Success-Story.pdf",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    title: 'Fashion Week Integration',
    description: 'Elevating the fashion week experience with AI photography',
    main_image_path: 'https://images.unsplash.com/photo-1509631179647-0177331693ae',
    pdf_path: '#',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const videos: Video[] = [
  {
    id: "1",  // Changed from number to string
    title: 'Kimera AI Product Overview',
    description: 'A comprehensive look at our AI photobooth solution',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279',
    downloadUrl: '#',
    duration: '2:15',
    fileSize: '48.2 MB'
  },
  {
    id: "2",  // Changed from number to string
    title: 'Setup Tutorial',
    description: 'Step-by-step guide to setting up the Kimera AI system',
    thumbnail: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb',
    downloadUrl: '#',
    duration: '4:30',
    fileSize: '86.5 MB'
  }
];
