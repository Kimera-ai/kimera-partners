import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from "lucide-react";

const benefits = [
  {
    benefit: "Discount on Event Packages",
    basic: "-",
    growth: "5% off",
    loyalty: "10% off",
  },
  {
    benefit: "Discount on AI Processing Credits",
    basic: "-",
    growth: "5% off",
    loyalty: "5% off",
  },
  {
    benefit: "Branded Experience (White Labeling)",
    basic: "Available for $130",
    growth: "Available for $130",
    loyalty: "1st branded event free",
  },
  {
    benefit: "Access to beta features",
    basic: "-",
    growth: "-",
    loyalty: "-",
  },
  {
    benefit: "Sales & Marketing Materials",
    basic: <div className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Partner Hub Access</div>,
    growth: <div className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Partner Hub Access</div>,
    loyalty: <div className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Custom co-marketing</div>,
  },
  {
    benefit: "Sales Support & Training",
    basic: "-",
    growth: "Group training sessions",
    loyalty: "1-on-1 strategy call",
  },
  {
    benefit: "Lead Generation & Referrals",
    basic: "-",
    growth: "Listed as "Trusted Partner"",
    loyalty: "Featured on website/socials",
  },
  {
    benefit: "AI Playground Access",
    basic: <div className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Full Access</div>,
    growth: <div className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Full Access</div>,
    loyalty: <div className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Full Access + Beta Features</div>,
  },
  {
    benefit: "Loyalty Rewards & Bonuses",
    basic: "-",
    growth: "-",
    loyalty: "Extra 1000 credits every 5 events",
  },
  {
    benefit: "Free optimized landing page",
    basic: "-",
    growth: "-",
    loyalty: "Yes",
  },
  {
    benefit: "Your Own Domain",
    basic: "-",
    growth: "-",
    loyalty: "Yes",
  },
  {
    benefit: "Dedicated Partner Support",
    basic: "Standard email support",
    growth: "Priority Email/Discord support",
    loyalty: "Priority support on Discord/Whatsapp",
  },
  {
    benefit: "Direct influence on our product roadmap",
    basic: "-",
    growth: "-",
    loyalty: <div className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Shape the future of AI photobooths with us</div>,
  },
];

const BenefitsTierTable = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-8">Partner Benefits by Tier</h2>
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px] bg-muted/50">Benefit</TableHead>
              <TableHead className="bg-muted/50">Basic (1-5 Events)</TableHead>
              <TableHead className="bg-muted/50">Growth (6-10 Events)</TableHead>
              <TableHead className="bg-muted/50">Loyalty (10+ Events)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benefits.map((benefit, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">{benefit.benefit}</TableCell>
                <TableCell>{benefit.basic}</TableCell>
                <TableCell>{benefit.growth}</TableCell>
                <TableCell>{benefit.loyalty}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BenefitsTierTable;