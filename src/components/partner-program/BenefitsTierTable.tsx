import { Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    benefit: "Free landing page with optimized for conversion",
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
  const CheckMark = () => (
    <div className="flex justify-center">
      <Check className="h-5 w-5 text-green-500" />
    </div>
  );

  const Dash = () => (
    <div className="flex justify-center">
      <span className="text-gray-400">-</span>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img src="/lovable-uploads/879070b2-a66d-419b-9a07-6e5ab90e68e4.png" alt="Target icon" className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Partner Benefits by Tier</h2>
        </div>
      </div>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[300px]">Benefit</TableHead>
              <TableHead>Basic (1-5 Events)</TableHead>
              <TableHead>Growth (6-10 Events)</TableHead>
              <TableHead>Loyalty (10+ Events)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benefits.map((benefit, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{benefit.benefit}</TableCell>
                <TableCell>{benefit.basic ? <CheckMark /> : <Dash />}</TableCell>
                <TableCell>{benefit.growth ? <CheckMark /> : <Dash />}</TableCell>
                <TableCell>{benefit.loyalty ? <CheckMark /> : <Dash />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BenefitsTierTable;