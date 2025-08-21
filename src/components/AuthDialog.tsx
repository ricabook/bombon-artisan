import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  nome: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const recoverySchema = z.object({
  email: z.string().email("Email inválido"),
});

const registerSchema = authSchema.extend({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "login" | "register";
}

const AuthDialog = ({ open, onOpenChange, mode }: AuthDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getRedirectUrl = () => {
    const env = (import.meta as any).env?.VITE_REDIRECT_URL?.trim();
    if (env) return env;
    try { return `${window.location.origin}/minha-conta`; } catch { return "https://crieseubombom.com.br/minha-conta"; }
  };
  const [isRecover, setIsRecover] = useState(false);

  const recoveryForm = useForm<z.infer<typeof recoverySchema>>({
    resolver: zodResolver(recoverySchema),
    defaultValues: { email: "" },
  });
  const { signUp, signIn } = useAuth();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(mode === "register" ? registerSchema : authSchema),
    defaultValues: {
      nome: "",
      telefone: "",
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      let result;
      if (mode === "register") {
        result = await signUp(data.nome || "", data.telefone || "", data.email, data.senha);
      } else {
        result = await signIn(data.email, data.senha);
      }

      if (result.error) {
        toast({
          title: "Erro",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sucesso",
          description: mode === "register" ? "Conta criada com sucesso!" : "Login realizado com sucesso!",
        });
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isLogin = mode === "login";

  
  const onSubmitRecovery = async (values: z.infer<typeof recoverySchema>) => {
    try {
      const redirectTo = getRedirectUrl();
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, { redirectTo });
      if (error) throw error;
      toast({
        title: "E-mail enviado",
        description: "Se o e-mail existir, você receberá um link para redefinir a senha.",
      });
      setIsRecover(false);
    } catch (error: any) {
      console.error('[resetPasswordForEmail]', error);
      toast({
        title: "Não foi possível enviar",
        description: error.message || "Tente novamente em instantes.",
        variant: "destructive",
      });
    }
  };

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            {isLogin ? "Entrar" : "Cadastrar"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            {isLogin 
              ? "Entre com seus dados para acessar sua conta"
              : "Crie sua conta para salvar suas criações"
            }
          </DialogDescription>
        </DialogHeader>

        {!isRecover && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite seu nome" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="Digite seu email" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isLogin && (
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(11) 99999-9999" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="Digite sua senha" 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            

            {isLogin && !isRecover && (
              <div className="text-right -mt-1 mb-2">
                <button type="button" onClick={() => setIsRecover(true)} className="text-xs underline text-muted-foreground hover:text-foreground">
                  Esqueci minha senha
                </button>
              </div>
            )}
            <div className="flex flex-col space-y-2 pt-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Processando..." : isLogin ? "Entrar" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>
        )}

        {isRecover && (
          <Form {...recoveryForm}>
            <form onSubmit={recoveryForm.handleSubmit(onSubmitRecovery)} className="space-y-4">
              <div className="grid gap-3">
                <FormField control={recoveryForm.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seuemail@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="grid gap-3">
                <Button type="submit" className="w-full">Enviar link de redefinição</Button>
                <Button type="button" variant="ghost" className="w-full" onClick={() => setIsRecover(false)}>Voltar ao login</Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;