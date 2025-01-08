import React, { useState } from 'react';
import { 
  Check, 
  Star, 
  Crown, 
  Rocket,
  ArrowRight,
  Globe,
  Shield,
  Users,
  Zap
} from 'lucide-react';
import BaseLayout from '@/components/layouts/BaseLayout';
import ApplicationForm from '@/components/partnerships/ApplicationForm';

// Hero Section Component
const HeroSection = () => (
  <div className="text-center mb-20">
    <h1 className="text-4xl md:text-6xl text-white mb-6">
      Become a Design Partner with Kimera AI
    </h1>
    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
      Join us as an exclusive design partner and shape the future of AI-powered photobooth technology. 
      We're seeking exceptional photobooth owners committed to innovation and excellence.
    </p>
  </div>
);

// Partnership Tiers Component
const PartnershipTiers = () => {
  const tiers = [
    {
      name: 'Standard',
      icon: <Star className="text-[#FF2B6E]" size={24} />,
      price: '$299',
      period: '/month',
      description: 'Perfect for starting your AI photobooth journey',
      features: [
        'Access to core AI features',
        'Basic support',
        'Standard analytics',
        'Community forum access',
        'Regular updates'
      ],
      highlights: false
    },
    {
      name: 'Premium',
      icon: <Crown className="text-[#FF2B6E]" size={24} />,
      price: '$499',
      period: '/month',
      description: 'Advanced features for growing businesses',
      features: [
        'All Standard features',
        'Priority support',
        'Advanced analytics',
        'White-label options',
        'Early access to new features',
        'Training sessions'
      ],
      highlights: true
    },
    {
      name: 'Enterprise',
      icon: <Rocket className="text-[#FF2B6E]" size={24} />,
      price: 'Custom',
      period: '',
      description: 'Tailored solutions for large operations',
      features: [
        'All Premium features',
        '24/7 dedicated support',
        'Custom AI models',
        'Territory exclusivity options',
        'Custom integrations',
        'Strategic partnership'
      ],
      highlights: false
    }
  ];

  return (
    <div className="mb-20">
      <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Partnership Tiers</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <TierCard key={tier.name} {...tier} />
        ))}
      </div>
    </div>
  );
};

// Tier Card Component
const TierCard = ({ name, icon, price, period, description, features, highlights }) => (
  <div className={`
    bg-white/5 border rounded-xl p-8
    ${highlights 
      ? 'border-[#FF2B6E] relative overflow-hidden' 
      : 'border-white/10 hover:border-[#FF2B6E]/50'}
    transition-all duration-300 hover:-translate-y-1
  `}>
    {highlights && (
      <div className="absolute top-4 right-4">
        <span className="bg-[#FF2B6E] text-white text-xs px-3 py-1 rounded-full">
          Popular
        </span>
      </div>
    )}
    
    <div className="flex items-center gap-3 mb-4">
      {icon}
      <h3 className="text-xl text-white">{name}</h3>
    </div>
    
    <div className="mb-4">
      <div className="flex items-baseline">
        <span className="text-3xl text-white font-bold">{price}</span>
        <span className="text-gray-400 ml-2">{period}</span>
      </div>
      <p className="text-gray-300 mt-2">{description}</p>
    </div>
    
    <ul className="space-y-4 mb-8">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <Check className="text-[#FF2B6E] mt-1" size={16} />
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
    
    <button className={`
      w-full px-4 py-2 rounded-lg transition-colors
      ${highlights 
        ? 'bg-[#FF2B6E] hover:bg-[#FF068B] text-white' 
        : 'border border-white/20 hover:bg-white/20 text-white'}
    `}>
      Get Started
    </button>
  </div>
);

// Benefits Section Component
const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Globe size={24} />,
      title: 'Priority Access',
      description: 'Get unparalleled support and early access to cutting-edge features.'
    },
    {
      icon: <Zap size={24} />,
      title: 'A Voice in Innovation',
      description: 'Influence the next wave of AI photobooth advancements.'
    },
    {
      icon: <Rocket size={24} />,
      title: 'Growth-Driven Tools',
      description: 'Leverage exclusive tools to expand your business and capture new markets.'
    },
    {
      icon: <Shield size={24} />,
      title: 'Exclusive Technology',
      description: 'Be the first to offer the world's most advanced AI photobooth.'
    },
    {
      icon: <Users size={24} />,
      title: 'Collaborative Success',
      description: 'Benefit from our marketing reach and gain client referrals in your region.'
    }
  ];

  return (
    <div className="mb-20">
      <h2 className="text-3xl md:text-4xl text-white text-center mb-12">
        Partner Benefits
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {benefits.map((benefit) => (
          <BenefitCard key={benefit.title} {...benefit} />
        ))}
      </div>
    </div>
  );
};

// Benefit Card Component
const BenefitCard = ({ icon, title, description }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#FF2B6E]/50 transition-all duration-300 hover:-translate-y-1">
    <div className="text-[#FF2B6E] mb-4">{icon}</div>
    <h3 className="text-white text-lg mb-2">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

// Application Section Component
const ApplicationSection = ({ onOpenForm }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-8 md:p-12 text-center">
    <h2 className="text-3xl text-white mb-4">Think you've got what it takes?</h2>
    <p className="text-xl text-gray-300 mb-8">
      Apply now to start the conversation. Let's see if we're a perfect match.
    </p>
    <button 
      onClick={onOpenForm}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF2B6E] hover:bg-[#FF068B] text-white rounded-lg transition-colors"
    >
      Apply Now
      <ArrowRight size={20} />
    </button>
  </div>
);

const PartnershipsPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <BaseLayout>
      <HeroSection />
      <PartnershipTiers />
      <BenefitsSection />
      <ApplicationSection onOpenForm={() => setIsFormOpen(true)} />
      <ApplicationForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </BaseLayout>
  );
};

export default PartnershipsPage;