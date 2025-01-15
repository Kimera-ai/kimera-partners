import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CaseStudy } from "@/types/marketing";
import { supabase } from "@/integrations/supabase/client";

export const CaseStudyCard = ({ study }: { study: CaseStudy }) => {
  const handleDownload = async () => {
    try {
      const { data } = await supabase.storage
        .from('marketing_materials')
        .createSignedUrl(study.pdf_path, 60); // URL valid for 60 seconds

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        console.error('No signed URL generated for:', study.pdf_path);
      }
    } catch (error) {
      console.error('Error downloading case study:', error);
    }
  };

  // Get the public URL for the image directly from Supabase
  const imageUrl = `${supabase.storageUrl}/object/public/marketing_materials/${study.main_image_path}`;

  console.log('Rendering case study:', {
    title: study.title,
    imagePath: study.main_image_path,
    imageUrl: imageUrl,
    pdfPath: study.pdf_path
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
      <div className="aspect-video relative">
        <img 
          src={imageUrl} 
          alt={study.title} 
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-white text-xl mb-3">{study.title}</h3>
        <p className="text-gray-300 text-sm mb-4">{study.description}</p>
        <Button 
          variant="ghost" 
          className="text-white hover:text-primary w-full"
          onClick={handleDownload}
        >
          <Download size={20} className="mr-2" />
          <span>Download Case Study</span>
        </Button>
      </div>
    </div>
  );
};