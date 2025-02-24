
import { PricingCalculator } from "@/components/blocks/PricingCalculator";
import BaseLayout from "@/components/layouts/BaseLayout";
import { PricingCard } from "@/components/ui/dark-gradient-pricing";
import { useState } from "react";

const Pricing = () => {
  const [selectedBase, setSelectedBase] = useState<"baseEvent" | "brandedEvent" | null>(null);
  const [customWorkflows, setCustomWorkflows] = useState(0);

  const handleCalculateClick = (type: string) => {
    const calculatorElement = document.getElementById('pricing-calculator');
    if (calculatorElement) {
      if (type === "Branded Event") {
        setSelectedBase("brandedEvent");
        setCustomWorkflows(0);
      } else if (type === "Custom Workflows") {
        setSelectedBase("brandedEvent");
        setCustomWorkflows(1);
      }
      calculatorElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const pricingCards = [
    {
      tier: "Branded Event",
      price: "$130",
      bestFor: "Our flagship package combines advanced AI capabilities with complete brand customization. Create immersive, on-brand experiences with custom UI elements, branded outputs, and advanced engagement features that capture valuable customer insights.",
      CTA: "Calculate My Pricing",
      benefits: [
        { text: "All Base Package features", checked: true },
        { text: "White Labelled Email Template", checked: true },
        { text: "White Labelled Custom Form", checked: true },
        { text: "Transition Videos For Your Customers", checked: true },
        { text: "White Labelled and Branded UI", checked: true },
        { text: "Custom Image frames for your event", checked: true },
        { text: "Remove Kimera branding", checked: true },
      ],
      onCTAClick: () => handleCalculateClick("Branded Event"),
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
      onCTAClick: () => handleCalculateClick("Custom Workflows"),
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
          
          <div className="relative flex flex-col md:flex-row gap-8 max-w-7xl mx-auto mb-32 items-center">
            <div className="flex-1">
              <PricingCard {...pricingCards[0]} />
            </div>
            <div className="hidden md:flex items-center justify-center">
              <span className="text-6xl font-bold text-purple-400/50">+</span>
            </div>
            <div className="flex-1">
              <PricingCard {...pricingCards[1]} />
            </div>
          </div>

          <div className="w-full max-w-5xl mx-auto">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Customize Your Package
              </h2>
              <PricingCalculator 
                initialBase={selectedBase} 
                initialCustomWorkflows={customWorkflows}
              />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Pricing;
