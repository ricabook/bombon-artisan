import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is not set')
    }

    const { prompt } = await req.json()
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log("Generating image with prompt:", prompt)

    // Translate Portuguese terms to English
    const translations = {
      'Chocolate ao Leite': 'Milk Chocolate',
      'Chocolate Meio Amargo': 'Semi Sweet Chocolate',
      'Chocolate Branco': 'White Chocolate',
      'Chocolate 70% Cacau': '70% Cocoa Chocolate',
      'Biscoito Triturado': 'Crushed Cookies',
      'Castanha Triturada': 'Crushed Nuts',
      'Coco Ralado': 'Shredded Coconut',
      'Sem Base': 'No Base',
      'Ganache de Chocolate': 'Chocolate Ganache',
      'Ganache de Caramelo': 'Caramel Ganache',
      'Ganache de Frutas Vermelhas': 'Red Berries Ganache',
      'Ganache de Maracujá': 'Passion Fruit Ganache',
      'Ganache de Café': 'Coffee Ganache',
      'Geleia de Morango': 'Strawberry Jam',
      'Geleia de Framboesa': 'Raspberry Jam',
      'Geleia de Maracujá': 'Passion Fruit Jam',
      'Geleia de Damasco': 'Apricot Jam',
      'Sem Geleia': 'No Jam',
      'Rosa': 'Pink',
      'Azul': 'Blue',
      'Verde': 'Green',
      'Amarelo': 'Yellow',
      'Roxo': 'Purple',
      'Laranja': 'Orange',
      'Vermelho': 'Red',
      'Branco': 'White',
      'Foto realista, bombom artesanal': 'Photorealistic artisanal bonbon',
      'pintado de': 'painted in',
      'O bombom está cortado ao meio, mostrando a seção interna': 'The bonbon is cut in half, showing the internal cross-section',
      'que está dividida da seguinte forma, de baixo para cima': 'which is divided as follows, from bottom to top',
      'Até 10% de altura': 'Up to 10% height',
      'Da base até 80% de altura': 'From base to 80% height',
      'Da base até 90% de altura': 'From base to 90% height',
      'Ocupa os 20% restantes do topo': 'Occupies the remaining 20% at the top',
      'Cenário neutro, iluminação de estúdio, aspecto profissional (produto)': 'Neutral background, studio lighting, professional product photography',
      'Sem letras, sem logos, sem objetos extras': 'No text, no logos, no extra objects'
    }

    let englishPrompt = prompt
    Object.entries(translations).forEach(([portuguese, english]) => {
      englishPrompt = englishPrompt.replace(new RegExp(portuguese, 'g'), english)
    })

    console.log("Translated prompt:", englishPrompt)

    // Call Google Gemini generateContent API for image generation
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GOOGLE_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: englishPrompt
          }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Google Gemini error:', errorData)
      throw new Error(`Google Gemini API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    console.log("Gemini response:", data)
    
    // Find the image part in the response
    let imageBase64 = null
    if (data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0]
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            imageBase64 = part.inlineData.data
            break
          }
        }
      }
    }
    
    if (!imageBase64) {
      throw new Error('No image generated in response')
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        imageBase64: imageBase64,
        imageUrl: `data:image/png;base64,${imageBase64}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to generate image',
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})