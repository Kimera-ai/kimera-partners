
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { VisualAsset } from "@/types/marketing";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const VisualAssetCard = ({ asset }: { asset: VisualAsset }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (isDownloading) return;
    
    try {
      setIsDownloading(true);
      
      if (asset.title === 'Kimera AI Logo Pack') {
        const logoPackUrl = 'https://gerodpwicbuukllgkmzg.supabase.co/storage/v1/object/public/marketing_materials/Logo%20design.rar?t=2025-01-15T14%3A16%3A41.368Z';
        
        const response = await fetch(logoPackUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kimera-logo-pack.rar';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Success",
          description: "Logo pack downloaded successfully",
          duration: 3000
        });
      } else {
        // For regular images, open in new tab or download directly
        const fileName = asset.title.toLowerCase().replace(/\s+/g, '-') + '.jpg';
        
        if (asset.downloadUrl.includes('cdn-cgi/image/format=jpeg')) {
          // Handle Kimera image URLs with special format
          const response = await fetch(asset.downloadUrl, {
            method: 'GET',
            mode: 'cors',
            headers: {
              'Accept': 'image/jpeg,image/png,image/*'
            }
          });
          
          if (!response.ok) throw new Error('Network response was not ok');
          
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else {
          // Regular download URL handling
          window.open(asset.downloadUrl, '_blank');
        }
        
        toast({
          title: "Success",
          description: `${asset.title} downloaded successfully`,
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download the file. Please try again.",
        duration: 5000
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
      <div className="aspect-video relative group">
        <img 
          src={asset.thumbnail} 
          alt={asset.title} 
          className="w-full h-full object-cover"
          loading="lazy" // Add lazy loading for better performance
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <Button 
            variant="default" 
            size="icon" 
            className={`bg-primary hover:bg-primary-hover ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            <Download className="text-white" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
