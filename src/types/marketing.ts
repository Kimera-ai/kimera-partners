export interface VisualAsset {
  id: number;
  type: string;
  category: string;
  title: string;
  description: string;
  thumbnail: string;
  downloadUrl: string;
  dimensions: string;
  fileSize: string;
  tags: string[];
}

export interface Template {
  id: number;
  type: string;
  title: string;
  description: string;
  thumbnail: string;
  downloadUrl: string;
  format: string;
  fileSize: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  main_image_path: string;
  pdf_path: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  downloadUrl: string;
  duration: string;
  fileSize: string;
}