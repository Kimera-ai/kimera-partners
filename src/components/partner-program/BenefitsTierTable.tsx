import { PricingCard } from "@/components/ui/dark-gradient-pricing";

const BenefitsTierTable = () => {
  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-12 space-y-3">
          <h2 className="text-center text-3xl font-semibold leading-tight sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
            Partner Benefits by Tier
          </h2>
          <p className="text-center text-base text-muted-foreground md:text-lg">
            Choose the partnership tier that best fits your business needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <PricingCard
            tier="Basic"
            price="1-5 Events"
            bestFor="Best for getting started"
            CTA="Get started"
            benefits={[
              { text: "Partner Hub Access", checked: true },
              { text: "Standard Email Support", checked: true },
              { text: "AI Playground Access", checked: true },
              { text: "White Labeling ($130)", checked: true },
              { text: "Lead Generation", checked: false },
              { text: "Priority Support", checked: false },
              { text: "Custom Co-marketing", checked: false },
              { text: "Free Landing Page", checked: false },
            ]}
          />
          <PricingCard
            tier="Growth"
            price="6-10 Events"
            bestFor="Best for growing businesses"
            CTA="Level up"
            benefits={[
              { text: "Partner Hub Access", checked: true },
              { text: "Priority Email/Discord Support", checked: true },
              { text: "AI Playground Access", checked: true },
              { text: "White Labeling ($130)", checked: true },
              { text: "Listed as Trusted Partner", checked: true },
              { text: "Group Training Sessions", checked: true },
              { text: "5% Discount on Packages", checked: true },
              { text: "5% off AI Credits", checked: true },
            ]}
          />
          <PricingCard
            tier="Loyalty"
            price="10+ Events"
            bestFor="Best for established partners"
            CTA="Join elite partners"
            benefits={[
              { text: "Partner Hub + Custom Co-marketing", checked: true },
              { text: "Priority Discord/WhatsApp Support", checked: true },
              { text: "AI Playground + Beta Features", checked: true },
              { text: "1st Branded Event Free", checked: true },
              { text: "Featured Partner Status", checked: true },
              { text: "1-on-1 Strategy Calls", checked: true },
              { text: "10% Discount on Packages", checked: true },
              { text: "Free Landing Page & Domain", checked: true },
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsTierTable;