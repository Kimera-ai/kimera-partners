
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useImageUpload = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to fix image orientation before uploading
  const fixImageOrientation = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      // Create a FileReader to read the image file
      const reader = new FileReader();
      
      reader.onload = (event) => {
        // Create an image element to load the image data
        const img = document.createElement('img');
        img.onload = () => {
          // Create a canvas to draw the properly oriented image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            // If can't get context, return the original file
            resolve(file);
            return;
          }
          
          // Set canvas size to match the image dimensions
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw the image on the canvas with correct orientation
          ctx.drawImage(img, 0, 0);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (!blob) {
              // If conversion fails, return the original file
              resolve(file);
              return;
            }
            
            // Create a new file from the blob
            const correctedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified
            });
            
            resolve(correctedFile);
          }, file.type);
        };
        
        // Set the source of the image to the file data
        if (event.target?.result) {
          img.src = event.target.result as string;
        } else {
          // If reading fails, return the original file
          resolve(file);
        }
      };
      
      reader.onerror = () => {
        // If reading fails, return the original file
        resolve(file);
      };
      
      // Read the file as a data URL
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      
      // Read file for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Fix image orientation before uploading
      const correctedFile = await fixImageOrientation(file);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, correctedFile);
      
      if (uploadError) {
        throw new Error('Failed to upload image to storage');
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      setUploadedImageUrl(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
        duration: 5000
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
        duration: 5000
      });
      setImagePreview(null);
      setUploadedImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImagePreview(null);
    setUploadedImageUrl(null);
  };

  return {
    imagePreview,
    setImagePreview,
    isUploading,
    uploadedImageUrl,
    setUploadedImageUrl,
    handleImageUpload,
    removeImage
  };
};
