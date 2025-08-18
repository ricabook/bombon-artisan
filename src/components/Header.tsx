import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthDialog from "./AuthDialog";

const Header = () => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const handleOpenAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthDialogOpen(true);
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-chocolate rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">🍫</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Chocolateria
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleOpenAuth("login")}
          >
            Entrar
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => handleOpenAuth("register")}
          >
            Cadastrar
          </Button>
        </div>
      </div>

      <AuthDialog 
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        mode={authMode}
      />
    </header>
  );
};

export default Header;