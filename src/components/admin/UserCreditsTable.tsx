
import React from 'react';
import { useUserCreditsTable } from '@/hooks/useUserCreditsTable';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export const UserCreditsTable = () => {
  const { creditRows, isLoading } = useUserCreditsTable();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Credits</TableHead>
            <TableHead>Last Reset</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {creditRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                No user credits found
              </TableCell>
            </TableRow>
          ) : (
            creditRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.email}</TableCell>
                <TableCell className="text-right font-medium">{row.credits.toLocaleString()}</TableCell>
                <TableCell>
                  {row.last_reset ? format(new Date(row.last_reset), 'MMM d, yyyy') : 'Never'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
