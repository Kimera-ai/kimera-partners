import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const BenefitsTableHeader = () => (
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead className="w-[200px]">Benefit</TableHead>
      <TableHead className="text-center w-[140px]">Basic (1-5 Events)</TableHead>
      <TableHead className="text-center w-[140px]">Growth (6-10 Events)</TableHead>
      <TableHead className="text-center w-[140px]">Loyalty (10+ Events)</TableHead>
    </TableRow>
  </TableHeader>
);