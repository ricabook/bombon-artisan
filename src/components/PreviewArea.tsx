import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";

interface Selection {
  chocolate?: { id: string; nome: string };
  base?: { id: string; nome: string };
  ganache?: { id: string; nome: string };
  geleia?: { id: string; nome: string };
  cor?: { id: string; nome: string; codigo_hex: string };
}

interface PreviewAreaProps {
  selection: Selection;
}

const PreviewArea = ({ selection }: PreviewAreaProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const generatePrompt = () => {
    if (!selection.chocolate || !selection.base || !selection.ganache || !selection.cor) {
      return "";
    }

    let prompt = `Gerar a imagem de um bombom de ${selection.chocolate.nome} com ${selection.base.nome}, recheio formado por ${selection.ganache.nome}`;
    
    if (selection.geleia && selection.geleia.nome !== "Sem Geleia") {
      prompt += ` e ${selection.geleia.nome}`;
    }
    
    prompt += `. Casquinha externa pintada de ${selection.cor.nome}.`;
    prompt += ` O bombom deve ser fotorrealista, com o chocolate escolhido visível no interior. A pintura colorida deve estar apenas na casquinha externa.`;
    
    return prompt;
  };

  const handleSendToProduction = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para enviar bombons para produção.",
        variant: "destructive",
      });
      return;
    }

    if (!selection.chocolate || !selection.base || !selection.ganache || !selection.cor) {
      toast({
        title: "Seleção incompleta",
        description: "Por favor, complete todas as seleções antes de enviar para produção.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = generatePrompt();
      
      const { error } = await supabase
        .from('bombons')
        .insert({
          user_id: user.id,
          chocolate_id: selection.chocolate.id,
          base_id: selection.base.id,
          ganache_id: selection.ganache.id,
          geleia_id: selection.geleia?.id || null,
          cor_id: selection.cor.id,
          prompt_gerado: prompt,
          status: 'enviado'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Enviado para produção!",
        description: "Seu bombom personalizado foi enviado para a loja.",
      });
    } catch (error) {
      console.error('Error sending to production:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar para produção. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Área de Preview da Imagem */}
      <Card>
        <CardHeader>
          <CardTitle>Preview do Bombom</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-background to-muted rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center text-muted-foreground">
              <div className="text-6xl mb-2">🍫</div>
              <p>Sua criação aparecerá aqui</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div><strong>Chocolate:</strong> {selection.chocolate?.nome || "Não selecionado"}</div>
            <div><strong>Base:</strong> {selection.base?.nome || "Não selecionado"}</div>
            <div><strong>Ganache:</strong> {selection.ganache?.nome || "Não selecionado"}</div>
            <div><strong>Geleia:</strong> {selection.geleia?.nome || "Não selecionado"}</div>
            <div className="flex items-center gap-2">
              <strong>Cor:</strong> 
              {selection.cor ? (
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded border border-border"
                    style={{ backgroundColor: selection.cor.codigo_hex }}
                  />
                  {selection.cor.nome}
                </div>
              ) : (
                "Não selecionado"
              )}
            </div>
          </div>
          
          <Button 
            className="w-full mt-4" 
            size="lg"
            onClick={handleSendToProduction}
            disabled={isGenerating || !user}
          >
            {isGenerating ? "Enviando..." : "Enviar para Produção"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewArea;