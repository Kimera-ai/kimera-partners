import { TableCell, TableRow } from "@/components/ui/table";
import { CheckMark, Dash } from "./TableIcons";

interface BenefitRowProps {
  benefit: {
    benefit: string;
    basic: boolean;
    growth: boolean;
    loyalty: boolean;
  };
}

export const BenefitRow = ({ benefit }: BenefitRowProps) => (
  <TableRow>
    <TableCell className="font-medium">{benefit.benefit}</TableCell>
    <TableCell className="text-center">
      <div className="flex items-center justify-center">
        {benefit.basic ? <CheckMark /> : <Dash />}
      </div>
    </TableCell>
    <TableCell className="text-center">
      <div className="flex items-center justify-center">
        {benefit.growth ? <CheckMark /> : <Dash />}
      </div>
    </TableCell>
    <TableCell className="text-center">
      <div className="flex items-center justify-center">
        {benefit.loyalty ? <CheckMark /> : <Dash />}
      </div>
    </TableCell>
  </TableRow>
);