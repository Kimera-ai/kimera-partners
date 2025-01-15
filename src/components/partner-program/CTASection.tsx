import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  setIsFormOpen: (open: boolean) => void;
}

const CTASection = ({ setIsFormOpen }: CTASectionProps) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto text-center rounded-2xl p-8 overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#222222]/95 to-[#9F9EA1]/10 backdrop-blur-sm" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#F1F1F1] to-[#9F9EA1] bg-clip-text text-transparent">
            Shape the Future of the Industry
          </h2>
          <p className="text-[#C8C8C9] mb-8">
            This is more than a partnership; it's a chance to shape the future of the industry while setting yourself apart as a leader. Think you've got what it takes?
          </p>
          <Button 
            size="lg"
            className="bg-[#9F9EA1] hover:bg-[#C8C8C9] text-background font-semibold px-8 py-6 h-auto"
            onClick={() => setIsFormOpen(true)}
          >
            Apply Now
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default CTASection;