import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CTASectionProps {
  setIsFormOpen: (open: boolean) => void;
}

const CTASection = ({ setIsFormOpen }: CTASectionProps) => {
  const navigate = useNavigate();

  return (
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
        <p className="text-[#C8C8C9] mb-8">
          This is more than a partnership; it's a chance to shape the future of the industry while setting yourself apart as a leader. Think you've got what it takes?
        </p>
        <Button 
          size="lg"
          className="bg-[#9F9EA1] hover:bg-[#C8C8C9] text-background font-semibold px-8 py-6 h-auto"
          onClick={() => navigate("/login")}
        >
          Apply Now
        </Button>
      </div>
    </motion.div>
  );
};

export default CTASection;