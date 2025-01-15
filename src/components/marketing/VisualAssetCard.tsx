import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { VisualAsset } from "@/types/marketing";

export const VisualAssetCard = ({ asset }: { asset: VisualAsset }) => {
  const handleDownload = async () => {
    if (asset.title === 'Kimera AI Logo Pack') {
      const logoPackUrl = 'https://gerodpwicbuukllgkmzg.supabase.co/storage/v1/object/public/marketing_materials/Logo%20design.rar?t=2025-01-15T14%3A16%3A41.368Z';
      
      try {
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
      } catch (error) {
        console.error('Error downloading file:', error);
      }
    } else {
      window.open(asset.downloadUrl, '_blank');
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
      <div className="aspect-video relative group">
        <img src={asset.thumbnail} alt={asset.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
          <Button 
            variant="default" 
            size="icon" 
            className="bg-primary hover:bg-primary-hover"
            onClick={handleDownload}
          >
            <Download className="text-white" size={20} />
          </Button>
        </div>
      </div>
      <div className="p-6">
        <div className="text-sm text-primary mb-2">{asset.category}</div>
        <h3 className="text-white text-lg mb-2">{asset.title}</h3>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>{asset.dimensions}</span>
          <span>{asset.fileSize}</span>
        </div>
      </div>
    </div>
  );
};