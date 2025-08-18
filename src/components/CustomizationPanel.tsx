import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Option {
  id: string;
  name: string;
  color?: string;
}

interface CustomizationSectionProps {
  title: string;
  options: Option[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

const CustomizationSection = ({ title, options, selectedId, onSelect }: CustomizationSectionProps) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant={selectedId === option.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(option.id)}
            className="justify-start h-auto p-3"
          >
            <div className="flex items-center space-x-2">
              {option.color && (
                <div 
                  className="w-4 h-4 rounded-full border border-border" 
                  style={{ backgroundColor: option.color }}
                />
              )}
              <span className="text-sm">{option.name}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

const CustomizationPanel = () => {
  const chocolateTypes = [
    { id: "milk", name: "Ao Leite" },
    { id: "dark", name: "Meio Amargo" },
    { id: "white", name: "Branco" },
    { id: "ruby", name: "Ruby" }
  ];

  const bases = [
    { id: "traditional", name: "Tradicional" },
    { id: "crispy", name: "Crocante" },
    { id: "wafer", name: "Wafer" }
  ];

  const ganaches = [
    { id: "vanilla", name: "Baunilha" },
    { id: "chocolate", name: "Chocolate" },
    { id: "caramel", name: "Caramelo" },
    { id: "coffee", name: "Café" },
    { id: "fruits", name: "Frutas Vermelhas" }
  ];

  const jellies = [
    { id: "none", name: "Sem Geleia" },
    { id: "strawberry", name: "Morango" },
    { id: "orange", name: "Laranja" },
    { id: "raspberry", name: "Framboesa" },
    { id: "passion", name: "Maracujá" }
  ];

  const colors = [
    { id: "pink", name: "Rosa", color: "#FFB6C1" },
    { id: "blue", name: "Azul", color: "#87CEEB" },
    { id: "gold", name: "Dourado", color: "#FFD700" },
    { id: "green", name: "Verde", color: "#98FB98" },
    { id: "purple", name: "Roxo", color: "#DDA0DD" },
    { id: "red", name: "Vermelho", color: "#FF6B6B" }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-chocolate-dark">
            Personalize seu Bombom
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CustomizationSection
            title="Tipo de Chocolate"
            options={chocolateTypes}
            onSelect={() => {}}
          />
          
          <CustomizationSection
            title="Base do Bombom"
            options={bases}
            onSelect={() => {}}
          />
          
          <CustomizationSection
            title="Ganache"
            options={ganaches}
            onSelect={() => {}}
          />
          
          <CustomizationSection
            title="Geleia"
            options={jellies}
            onSelect={() => {}}
          />
          
          <CustomizationSection
            title="Cor da Casquinha"
            options={colors}
            onSelect={() => {}}
          />
        </CardContent>
      </Card>

      <Button className="w-full bg-gradient-gold hover:bg-gold-dark text-chocolate-dark font-semibold py-3 shadow-elegant">
        Gerar Imagem do Bombom
      </Button>
    </div>
  );
};

export default CustomizationPanel;