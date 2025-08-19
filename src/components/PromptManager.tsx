import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { buildBombomPrompt, BombomOpcao } from "@/lib/buildBombomPrompt";

interface PromptConfig {
  id: string;
  base_prompt: string;
  negative_prompt: string;
}

const PromptManager = () => {
  const [promptConfig, setPromptConfig] = useState<PromptConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exemploPrompt, setExemploPrompt] = useState<{ prompt: string; negativePrompt: string } | null>(null);
  const { toast } = useToast();

  // Exemplo de seleção para mostrar o prompt
  const exemploSelecao: BombomOpcao = {
    corCasquinha: "Vermelho",
    tipoChocolate: "Chocolate ao Leite Belga",
    base: "base crocante de chocolate com sucrilhos",
    ganache: "ganache de morango",
    geleia: "geléia de morango"
  };

  useEffect(() => {
    fetchPromptConfig();
  }, []);

  useEffect(() => {
    if (promptConfig) {
      const exemplo = buildBombomPrompt(exemploSelecao, promptConfig);
      setExemploPrompt(exemplo);
    }
  }, [promptConfig]);

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
      toast({
        title: "Erro",
        description: "Erro ao carregar configuração de prompt.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!promptConfig) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('prompt_configs')
        .update({
          base_prompt: promptConfig.base_prompt,
          negative_prompt: promptConfig.negative_prompt,
        })
        .eq('id', promptConfig.id);

      if (error) {
        throw error;
      }

      // Atualizar o exemplo após salvar
      const exemplo = buildBombomPrompt(exemploSelecao, promptConfig);
      setExemploPrompt(exemplo);

      toast({
        title: "Sucesso",
        description: "Configuração de prompt salva com sucesso!",
      });
    } catch (error) {
      console.error('Erro ao salvar prompt:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configuração de prompt.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (!promptConfig) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Nenhuma configuração de prompt encontrada.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!exemploPrompt) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Preview do Prompt Atual */}
      <Card>
        <CardHeader>
          <CardTitle>Preview do Prompt Atual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Exemplo com seleção:</Label>
            <div className="text-xs text-muted-foreground mb-2">
              {exemploSelecao.tipoChocolate} • {exemploSelecao.corCasquinha} • {exemploSelecao.base} • {exemploSelecao.ganache} • {exemploSelecao.geleia}
            </div>
            <div className="bg-muted p-3 rounded-md text-sm">
              <strong>Prompt:</strong>
              <p className="mt-1">{exemploPrompt.prompt}</p>
            </div>
          </div>
          <div>
            <div className="bg-muted p-3 rounded-md text-sm">
              <strong>Negative Prompt:</strong>
              <p className="mt-1">{exemploPrompt.negativePrompt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuração do Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Configurar Prompt Base</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="base-prompt">Prompt Base</Label>
            <div className="text-xs text-muted-foreground mb-2">
              Use as variáveis: {'{tipoChocolate}'}, {'{pintura}'}, {'{estrutura}'}
            </div>
            <Textarea
              id="base-prompt"
              value={promptConfig.base_prompt}
              onChange={(e) => {
                const newConfig = {
                  ...promptConfig,
                  base_prompt: e.target.value
                };
                setPromptConfig(newConfig);
                // Atualizar preview em tempo real
                const exemplo = buildBombomPrompt(exemploSelecao, newConfig);
                setExemploPrompt(exemplo);
              }}
              className="min-h-[120px]"
              placeholder="Digite o prompt base aqui..."
            />
          </div>

          <div>
            <Label htmlFor="negative-prompt">Negative Prompt</Label>
            <Textarea
              id="negative-prompt"
              value={promptConfig.negative_prompt}
              onChange={(e) => {
                const newConfig = {
                  ...promptConfig,
                  negative_prompt: e.target.value
                };
                setPromptConfig(newConfig);
                // Atualizar preview em tempo real
                const exemplo = buildBombomPrompt(exemploSelecao, newConfig);
                setExemploPrompt(exemplo);
              }}
              className="min-h-[80px]"
              placeholder="Digite o negative prompt aqui..."
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Salvando..." : "Salvar Configuração"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptManager;