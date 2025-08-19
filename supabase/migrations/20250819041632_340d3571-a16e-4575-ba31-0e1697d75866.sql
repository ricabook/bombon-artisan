-- Criar tabela para configurações de prompt customizadas
CREATE TABLE public.prompt_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  base_prompt TEXT NOT NULL DEFAULT 'Foto de produto hiper-realista, bombom artesanal de {tipoChocolate}, {pintura}. O bombom está cortado ao meio, mostrando claramente a seção interna. Estrutura interna (de baixo para cima) com cortes limpos e camadas bem definidas: {estrutura} Iluminação de estúdio suave, fundo neutro, foco nítido, detalhes de textura do chocolate e recheio. Sem texto, sem logos, sem mãos, sem utensílios, sem objetos extras.',
  negative_prompt TEXT NOT NULL DEFAULT 'texto, legenda, marca d''água, mãos, pessoas, talheres, pratos, migalhas exageradas, deformações, borrado, baixa resolução, múltiplos bombons, colagem',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO public.prompt_configs (base_prompt, negative_prompt) VALUES (
  'Foto de produto hiper-realista, bombom artesanal de {tipoChocolate}, {pintura}. O bombom está cortado ao meio, mostrando claramente a seção interna. Estrutura interna (de baixo para cima) com cortes limpos e camadas bem definidas: {estrutura} Iluminação de estúdio suave, fundo neutro, foco nítido, detalhes de textura do chocolate e recheio. Sem texto, sem logos, sem mãos, sem utensílios, sem objetos extras.',
  'texto, legenda, marca d''água, mãos, pessoas, talheres, pratos, migalhas exageradas, deformações, borrado, baixa resolução, múltiplos bombons, colagem'
);

-- Enable RLS
ALTER TABLE public.prompt_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can manage prompt configs" 
ON public.prompt_configs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public can view prompt configs" 
ON public.prompt_configs 
FOR SELECT 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_prompt_configs_updated_at
BEFORE UPDATE ON public.prompt_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar coluna url_imagem_base64 na tabela bombons para salvar as imagens
ALTER TABLE public.bombons 
ADD COLUMN url_imagem_base64 TEXT;