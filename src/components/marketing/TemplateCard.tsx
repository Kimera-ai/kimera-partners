import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import { Template } from "@/types/marketing";

export const TemplateCard = ({ template }: { template: Template }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm">
    <div className="aspect-square relative group">
      <img src={template.thumbnail} alt={template.title} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
        <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20">
          <Download className="text-white" size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20">
          <Copy className="text-white" size={20} />
        </Button>
      </div>
    </div>
    <div className="p-6">
      <div className="text-sm text-primary mb-2">{template.type}</div>
      <h3 className="text-white text-lg mb-2">{template.title}</h3>
      <p className="text-gray-300 text-sm mb-3">{template.description}</p>
      <div className="flex items-center gap-4 text-sm text-gray-400">
        <span>{template.format}</span>
        <span>{template.fileSize}</span>
      </div>
    </div>
  </div>
);