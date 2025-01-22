import { PricingTableDemo } from "@/components/blocks/PricingTableDemo";
import { PricingCalculator } from "@/components/blocks/PricingCalculator";
import BaseLayout from "@/components/layouts/BaseLayout";

const Pricing = () => {
  return (
    <BaseLayout>
      <div className="py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
        <p className="text-lg text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your business. All plans include access to our core features.
        </p>
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