import { PricingTableDemo } from "@/components/blocks/PricingTableDemo";
import BaseLayout from "@/components/layouts/BaseLayout";

const Pricing = () => {
  return (
    <BaseLayout>
      <div className="py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Pricing Plans</h1>
        <p className="text-lg text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your business. All plans include access to our core features.
        </p>
        <PricingTableDemo />
      </div>
    </BaseLayout>
  );
};

export default Pricing;