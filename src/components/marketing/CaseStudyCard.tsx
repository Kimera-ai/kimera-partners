import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { CaseStudy } from "@/types/marketing";

export const CaseStudyCard = ({ study }: { study: CaseStudy }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
    <div className="aspect-video relative">
      <img src={study.thumbnail} alt={study.title} className="w-full h-full object-cover" />
    </div>
    <div className="p-6">
      <h3 className="text-white text-xl mb-3">{study.title}</h3>
      <p className="text-gray-300 text-sm mb-4">{study.description}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {study.results.map((result, index) => (
          <span 
            key={index}
            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {result}
          </span>
        ))}
      </div>
      <Button variant="ghost" className="text-white hover:text-primary">
        <Download size={20} className="mr-2" />
        <span>Download Case Study ({study.fileSize})</span>
      </Button>
    </div>
  </div>
);