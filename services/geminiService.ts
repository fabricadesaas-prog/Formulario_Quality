
import { GoogleGenAI, Part } from "@google/genai";
import type { PropertyData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to convert data URL to a Part object for the Gemini API
const dataUrlToGenerativePart = (dataUrl: string): Part => {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL format");
  }
  const mimeType = match[1];
  const data = match[2];

  return {
    inlineData: {
      mimeType,
      data,
    },
  };
};

export const generateTechnicalReport = async (data: PropertyData): Promise<string> => {
    const textPrompt = `
    **Tarefa:** Atue como um avaliador de imóveis profissional e experiente, filiado ao CRECI e com registro no CNAI. Sua tarefa é elaborar um Parecer Técnico de Avaliação Mercadológica (PTAM) conciso e bem-estruturado com base nos dados fornecidos do imóvel e na análise visual das imagens anexadas.

    **Estrutura do Parecer:** O parecer deve seguir rigorosamente a seguinte estrutura, utilizando Markdown para formatação (títulos, negrito e listas):

    ---

    ### **PARECER TÉCNICO DE AVALIAÇÃO MERCADOLÓGICA (PTAM)**

    **1. SOLICITANTE**
       - **Nome:** ${data.client_name}
       - **Qualificação:** ${data.requester_role}

    **2. OBJETIVO**
       - O presente parecer tem como objetivo a determinação do valor de mercado do imóvel descrito abaixo, para fins de **${data.objective}**.

    **3. IDENTIFICAÇÃO E CARACTERIZAÇÃO DO IMÓVEL**
       - **Endereço:** ${data.address.street}, nº ${data.address.number}, Bairro ${data.address.neighborhood}, ${data.address.city} - ${data.address.state}, CEP: ${data.address.zip}.
       - **Tipo de Imóvel:** ${data.property_type}.
       - **Medidas:**
         - Área do Terreno: ${data.land_area_m2 ? `${data.land_area_m2} m²` : 'Não informado'}.
         - Área Construída: ${data.built_area_m2 ? `${data.built_area_m2} m²` : 'Não informado'}.
       - **Características Construtivas:**
         - Idade Aparente da Construção: ${data.construction_age_years ? `Aproximadamente ${data.construction_age_years} anos` : 'Não informado'}.
         - Estado de Conservação: Com base na descrição textual e na análise visual das fotos, o estado de conservação é **[Analise a 'condition_description' E AS IMAGENS e classifique como: Novo, Bom, Regular, Mau, Péssimo]**.
         - Descrição Sumária: ${data.condition_description}.

    **4. ANÁLISE DO MERCADO E METODOLOGIA**
       - **Metodologia:** Para a presente avaliação, foi utilizado o Método Comparativo Direto de Dados de Mercado, conforme preconiza a NBR 14.653 da ABNT, com análise visual das imagens para aferição precisa das características do imóvel.
       - **Análise da Região:** O imóvel está localizado no bairro ${data.address.neighborhood}, uma área [Descreva brevemente as características da região: residencial, comercial, mista, infraestrutura, etc.].
       - **Pesquisa de Mercado:** Foi realizada uma pesquisa de imóveis com características semelhantes na região. [Simule uma breve análise, mencionando que foram encontrados imóveis com valores entre X e Y, e que a média do m² na região é de Z].

    **5. CONCLUSÃO E VALOR DE MERCADO**
       - Com base nos dados coletados, na análise do mercado, nas imagens e nas características do imóvel avaliado, conclui-se que o valor de mercado estimado para o referido imóvel é de:
       - **VALOR SUGERIDO: R$ [Estime um valor monetário realista com base em todos os dados fornecidos, especialmente área, localização, condição E ANÁLISE DAS FOTOS].**
       - **VALOR POR EXTENSO: ([Escreva o valor por extenso]).**

    **6. OBSERVAÇÕES FINAIS**
       - Este parecer é válido por 90 dias, podendo sofrer alterações devido a flutuações do mercado imobiliário.
       - A situação documental, conforme informado pelo solicitante, é: "${data.document_status}". Recomenda-se uma análise jurídica completa da documentação.
       - O imóvel encontra-se **${data.occupancy}**.

    ---

    **Instruções Adicionais:**
    - Seja objetivo e técnico.
    - **NÃO** inclua informações sobre você (a IA).
    - **NÃO** adicione notas de rodapé ou explicações fora da estrutura solicitada.
    - Preencha as seções entre colchetes **[...]** com análises plausíveis baseadas nos dados de entrada e, crucialmente, nas imagens.
    - A estimativa de valor deve ser coerente com as informações fornecidas. Um imóvel maior, mais novo e em bom estado em uma cidade grande, e com boa aparência nas fotos, deve ter um valor mais alto.
    `;
    
  try {
    const imageParts = data.photos.map(dataUrlToGenerativePart);
    const textPart: Part = { text: textPrompt };

    // The first part of the contents should be the main text prompt.
    // The subsequent parts are the images.
    const contents = { parts: [textPart, ...imageParts] };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate report from Gemini API.");
  }
};
