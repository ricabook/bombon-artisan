import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PromptConfig {
  id: string;
  base_prompt: string;
  negative_prompt: string;
}

export const usePromptConfig = () => {
  const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromptConfig();
  }, []);

  const fetchPromptConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('prompt_configs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setPromptConfig(data);
      }
    } catch (error) {
      console.error('Erro ao buscar configuração de prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  return { promptConfig, loading, refetch: fetchPromptConfig };
};