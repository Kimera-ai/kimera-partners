import { Handshake, Trophy, Building, Users, Star, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: Star,
    title: "Priority Access",
    description: "Get unparalleled support and early access to cutting-edge features.",
    gradient: "from-[#8B5CF6]/20 to-[#8B5CF6]/5",
    iconColor: "#8B5CF6"
  },
  {
    icon: Users,
    title: "A Voice in Innovation",
    description: "Direct influence on our product roadmap and feature development priorities. Shape the future of AI photobooths with us.",
    gradient: "from-[#34D399]/20 to-[#34D399]/5",
    iconColor: "#34D399"
  },
  {
    icon: Trophy,
    title: "Growth-Driven Tools",
    description: "Access exclusive marketing kits, sales materials, and business growth tools to expand your reach and capture new markets.",
    gradient: "from-[#F97316]/20 to-[#F97316]/5",
    iconColor: "#F97316"
  },
  {
    icon: Building,
    title: "Exclusive Technology",
    description: "Be the first to offer the world's most advanced AI photobooth.",
    gradient: "from-[#3B82F6]/20 to-[#3B82F6]/5",
    iconColor: "#3B82F6"
  },
  {
    icon: LinkIcon,
    title: "Collaborative Success",
    description: "Featured placement on our website, inclusion in paid advertising campaigns, and direct client referrals in your region.",
    gradient: "from-[#EC4899]/20 to-[#EC4899]/5",
    iconColor: "#EC4899"
  },
  {
    icon: Handshake,
    title: "White-Label Options",
    description: "Deploy Kimera technology under your own brand name and domain, maintaining full control of your market presence.",
    gradient: "from-[#F59E0B]/20 to-[#F59E0B]/5",
    iconColor: "#F59E0B"
  }
];

const BenefitsGrid = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br border border-white/10 backdrop-blur-sm group hover:border-white/20 transition-all duration-300"
          >
            {/* Large background icon */}
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
              <benefit.icon size={180} className="text-white" />
            </div>
            
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient}`} />
            
            {/* Content */}
            <div className="relative z-10 p-6">
              <benefit.icon 
                className="w-10 h-10 mb-4" 
                style={{ color: benefit.iconColor }} 
              />
              <h3 className="text-xl font-semibold mb-3 text-white">
                {benefit.title}
              </h3>
              <p className="text-white/70">
                {benefit.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsGrid;