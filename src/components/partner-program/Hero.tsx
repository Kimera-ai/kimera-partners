import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative overflow-hidden py-16">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-[#222222] to-[#9F9EA1]/5" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#F1F1F1] to-[#9F9EA1] bg-clip-text text-transparent">
            Become a Design Partner with Kimera AI
          </h1>
          <p className="text-lg md:text-xl text-[#C8C8C9] mb-8">
            Kimera AI is seeking exceptional photobooth owners from around the world to join us as exclusive design partners. This is a unique opportunity to collaborate with the leader in AI-powered photobooth technology.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;