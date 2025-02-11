import { PricingCalculator } from "@/components/blocks/PricingCalculator";
import BaseLayout from "@/components/layouts/BaseLayout";
import { PricingCard } from "@/components/ui/dark-gradient-pricing";

const Pricing = () => {
  const pricingCards = [
    {
      tier: "Basic Event",
      price: "$79",
      bestFor: "Perfect for brands seeking to elevate their events with AI-powered experiences. Includes our core AI transformation technology, real-time photo effects, and seamless digital delivery system, all backed by enterprise-grade support.",
      CTA: "Calculate My Pricing",
      benefits: [
        { text: "AI-powered transformations", checked: true },
        { text: "14-day access to platform and images", checked: true },
        { text: "Multi-language support", checked: true },
        { text: "Image delivery via email, WhatsApp, and SMS", checked: true },
        { text: "Unmatched live event Support", checked: true },
        { text: "Unlimited device usage for your devices", checked: true },
        { text: "Access to our theme library with 100+ themes", checked: true },
      ],
    },
    {
      tier: "Branded Event",
      price: "$130",
      bestFor: "Our flagship package combines advanced AI capabilities with complete brand customization. Create immersive, on-brand experiences with custom UI elements, branded outputs, and advanced engagement features that capture valuable customer insights.",
      CTA: "Calculate My Pricing",
      popular: true,
      benefits: [
        { text: "All Base Package features", checked: true },
        { text: "White Labelled Email Template", checked: true },
        { text: "White Labelled Custom Form", checked: true },
        { text: "Transition Videos For Your Customers", checked: true },
        { text: "White Labelled and Branded UI", checked: true },
        { text: "Custom Image frames for your event", checked: true },
        { text: "Remove Kimera branding", checked: true },
      ],
    },
    {
      tier: "Custom Workflows",
      price: "+$150",
      bestFor: "Add custom AI workflows to any event package",
      CTA: "Calculate My Pricing",
      benefits: [
        { text: "Custom AI workflow", checked: true },
        { text: "Dedicated support", checked: true },
        { text: "Custom integrations", checked: true },
        { text: "Advanced features", checked: true },
        { text: "Technical consultation", checked: true },
        { text: "Custom development", checked: true },
      ],
    },
  ];

  return (
    <BaseLayout>
      <div className="relative min-h-screen bg-[#100919]">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />
        
        <div className="relative container px-4 py-16 md:py-24">
          <div className="text-center space-y-6 mb-20">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan for your event. All plans include access to our core AI features.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-32">
            {pricingCards.map((card, index) => (
              <PricingCard
                key={card.tier}
                {...card}
              />
            ))}
          </div>

          <div className="w-full max-w-5xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Customize Your Package
              </h2>
              <PricingCalculator />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Pricing;