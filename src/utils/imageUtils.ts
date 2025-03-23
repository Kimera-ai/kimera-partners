
import { useToast } from "@/hooks/use-toast";

export const useImageDownloader = () => {
  const { toast } = useToast();

  const handleDownload = async (url: string) => {
    try {
      if (!url) throw new Error('No URL provided');
      
      // Check if it's a video URL
      const isVideo = /\.(mp4|webm|mov)($|\?)/.test(url.toLowerCase());
      
      // Extract the direct URL if necessary
      let directUrl = url;
      if (url.includes('format=jpeg/')) {
        const s3Url = url.split('format=jpeg/')[1];
        if (s3Url) directUrl = s3Url;
      }
      
      console.log(`Downloading ${isVideo ? 'video' : 'image'} from:`, directUrl);
      
      // Fetch the content
      const response = await fetch(directUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': isVideo ? 'video/*' : 'image/jpeg,image/png,image/*'
        }
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      // Convert to blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      // Set appropriate filename with timestamp and extension
      const timestamp = Date.now();
      const extension = isVideo ? 'mp4' : 'jpg';
      a.download = `generated-${isVideo ? 'video' : 'image'}-${timestamp}.${extension}`;
      
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
      
      toast({
        title: "Success",
        description: `${isVideo ? 'Video' : 'Image'} downloaded successfully`,
        duration: 5000
      });
    } catch (error) {
      console.error(`Error downloading ${url.includes('.mp4') ? 'video' : 'image'}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to download. Please try again or right-click and 'Save As'`,
        duration: 5000
      });
    }
  };

  return { handleDownload };
};
