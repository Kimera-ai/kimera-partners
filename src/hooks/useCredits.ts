
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCredits = (session: any) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (session?.user) {
      fetchUserCredits();
    }
  }, [session?.user]);

  const fetchUserCredits = async () => {
    try {
      setIsLoadingCredits(true);
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', session?.user?.id)
        .single();
      
      if (error) throw error;
      setCredits(data?.credits ?? null);
    } catch (error) {
      console.error('Error fetching credits:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch credits",
        duration: 5000
      });
    } finally {
      setIsLoadingCredits(false);
    }
  };

  const updateUserCredits = async (creditsToDeduct: number) => {
    try {
      const { data, error } = await supabase
        .from('user_credits')
        .update({
          credits: (credits ?? 0) - creditsToDeduct,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', session?.user?.id)
        .select('credits')
        .single();
      
      if (error) throw error;
      setCredits(data?.credits ?? null);
      return true;
    } catch (error) {
      console.error('Error updating credits:', error);
      return false;
    }
  };

  return {
    credits,
    setCredits,
    isLoadingCredits,
    fetchUserCredits,
    updateUserCredits
  };
};
