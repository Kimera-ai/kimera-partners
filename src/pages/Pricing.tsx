import { PricingTableDemo } from "@/components/blocks/PricingTableDemo";
import { PricingCalculator } from "@/components/blocks/PricingCalculator";
import BaseLayout from "@/components/layouts/BaseLayout";
import { PricingCard } from "@/components/ui/dark-gradient-pricing";

const Pricing = () => {
  const pricingCards = [
    {
      tier: "Basic Event",
      price: "$79",
      bestFor: "Perfect for small events and gatherings",
      CTA: "Get Started",
      benefits: [
        { text: "Basic event setup", checked: true },
        { text: "Standard support", checked: true },
        { text: "Basic analytics", checked: true },
        { text: "Up to 100 guests", checked: true },
        { text: "Standard templates", checked: true },
        { text: "Basic customization", checked: true },
      ],
    },
    {
      tier: "Branded Event",
      price: "$130",
      bestFor: "Ideal for corporate events and brand activations",
      CTA: "Get Started",
      benefits: [
        { text: "Everything in Basic", checked: true },
        { text: "Custom branding", checked: true },
        { text: "Priority support", checked: true },
        { text: "Advanced analytics", checked: true },
        { text: "Unlimited guests", checked: true },
        { text: "Premium templates", checked: true },
      ],
    },
    {
      tier: "Custom Pipelines",
      price: "$150",
      bestFor: "For unique AI experiences and custom workflows",
      CTA: "Contact Us",
      benefits: [
        { text: "Custom AI pipeline", checked: true },
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
      <div className="py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
        <p className="text-lg text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your business. All plans include access to our core features.
        </p>
        
        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 mb-24">
          {pricingCards.map((card, index) => (
            <PricingCard
              key={card.tier}
              {...card}
              className={index === 1 ? "md:scale-105" : ""}
            />
          ))}
        </div>

        <div className="grid gap-12">
          <PricingTableDemo />
          <div className="max-w-3xl mx-auto w-full">
            <PricingCalculator />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Pricing;