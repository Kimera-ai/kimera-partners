import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const BenefitsTableHeader = () => (
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead className="w-[200px] text-center text-lg font-bold text-primary">Benefit</TableHead>
      <TableHead className="text-center w-[140px] text-lg font-bold text-primary">Basic (1-5 Events)</TableHead>
      <TableHead className="text-center w-[140px] text-lg font-bold text-primary">Growth (6-10 Events)</TableHead>
      <TableHead className="text-center w-[140px] text-lg font-bold text-primary">Loyalty (10+ Events)</TableHead>
    </TableRow>
  </TableHeader>
);