
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserCreditRow {
  id: string;
  email: string;
  credits: number;
  last_reset: string | null;
}

export const useUserCreditsTable = () => {
  const [creditRows, setCreditRows] = useState<UserCreditRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserCreditsWithEmails = async () => {
    try {
      setIsLoading(true);
      
      // Join user_credits with profiles to get emails
      const { data, error } = await supabase
        .from('user_credits')
        .select(`
          user_id,
          credits,
          last_reset,
          profiles:user_id(email)
        `)
        .order('credits', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const formattedData: UserCreditRow[] = data.map(row => ({
          id: row.user_id,
          email: row.profiles?.email || 'Unknown',
          credits: row.credits,
          last_reset: row.last_reset
        }));
        
        setCreditRows(formattedData);
      }
    } catch (error) {
      console.error('Error fetching credits with emails:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch user credits",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCreditsWithEmails();
  }, []);

  return {
    creditRows,
    isLoading,
    fetchUserCreditsWithEmails
  };
};
