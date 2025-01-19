import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const BenefitsTableHeader = () => (
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead className="w-[250px]">Benefit</TableHead>
      <TableHead className="text-center">Basic (1-5 Events)</TableHead>
      <TableHead className="text-center">Growth (6-10 Events)</TableHead>
      <TableHead className="text-center">Loyalty (10+ Events)</TableHead>
    </TableRow>
  </TableHeader>
);