import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const PreviewArea = () => {
  return (
    <div className="space-y-6">
      {/* Image Generation Area */}
      <Card className="aspect-square">
        <CardContent className="h-full flex flex-col items-center justify-center p-8">
          <div className="w-full h-full bg-gradient-cream rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-border">
            <div className="text-6xl mb-4">🍫</div>
            <p className="text-muted-foreground text-center">
              Sua criação aparecerá aqui após a geração
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Selecione as opções e clique em "Gerar Imagem"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 text-chocolate-dark">
            Resumo do Pedido
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Chocolate:</span>
              <Badge variant="secondary">Não selecionado</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Base:</span>
              <Badge variant="secondary">Não selecionado</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ganache:</span>
              <Badge variant="secondary">Não selecionado</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Geleia:</span>
              <Badge variant="secondary">Não selecionado</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Cor:</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded-full bg-muted border border-border"></div>
                <Badge variant="secondary">Não selecionado</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Complete sua personalização para visualizar o bombom
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreviewArea;