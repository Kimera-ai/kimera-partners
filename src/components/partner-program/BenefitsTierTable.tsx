import { Check } from "lucide-react";
import { Table, TableBody } from "@/components/ui/table";
import { BenefitsTableHeader } from "./table/BenefitsTableHeader";
import { BenefitRow } from "./table/BenefitRow";

const benefits = [
  {
    benefit: "Branded Experience (White Labeling)",
    basic: true,
    growth: true,
    loyalty: true,
  },
  {
    benefit: "AI Playground Access",
    basic: true,
    growth: true,
    loyalty: true,
  },
  {
    benefit: "Partner Hub Access",
    basic: true,
    growth: true,
    loyalty: true,
  },
  {
    benefit: "Tools hub Access",
    basic: true,
    growth: true,
    loyalty: true,
  },
  {
    benefit: "Standard Email Support",
    basic: true,
    growth: true,
    loyalty: true,
  },
  {
    benefit: "Premium Discord/Whatsapp support",
    basic: false,
    growth: true,
    loyalty: true,
  },
  {
    benefit: "10% Discount on Event Packages",
    basic: false,
    growth: true,
    loyalty: true,
  },
  {
    benefit: "5% Discount on AI Processing Credits",
    basic: false,
    growth: true,
    loyalty: true,
  },
  {
    benefit: "Free 1000 credits every 5 events",
    basic: false,
    growth: false,
    loyalty: true,
  },
  {
    benefit: "Access to beta features",
    basic: false,
    growth: false,
    loyalty: true,
  },
  {
    benefit: "Weekly strategy calls",
    basic: false,
    growth: false,
    loyalty: true,
  },
  {
    benefit: "Listed as \"Trusted Partner\"",
    basic: false,
    growth: false,
    loyalty: true,
  },
  {
    benefit: "influence on our product roadmap",
    basic: false,
    growth: false,
    loyalty: true,
  },
  {
    benefit: "Free landing page optimized for conversion",
    basic: false,
    growth: false,
    loyalty: true,
  },
  {
    benefit: "Custom Domains",
    basic: false,
    growth: false,
    loyalty: true,
  },
];

const BenefitsTierTable = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img src="/lovable-uploads/879070b2-a66d-419b-9a07-6e5ab90e68e4.png" alt="Target icon" className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Partner Benefits by Tier</h2>
        </div>
      </div>
      <div className="max-w-4xl mx-auto rounded-xl border backdrop-blur-md bg-white/10 dark:bg-slate-900/50 shadow-xl">
        <Table>
          <BenefitsTableHeader />
          <TableBody>
            {benefits.map((benefit, index) => (
              <BenefitRow key={index} benefit={benefit} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BenefitsTierTable;
