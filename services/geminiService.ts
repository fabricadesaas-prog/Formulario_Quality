
import { GoogleGenAI } from "@google/genai";
import type { PropertyData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const formatDataForPrompt = (data: PropertyData): string => {
  return `
- **Nome do Cliente:** ${data.client_name}
- **Solicitante:** ${data.requester_role}
- **Endereço:** ${data.address.street}, nº ${data.address.number}, Bairro ${data.address.neighborhood}, ${data.address.city}/${data.address.state}, CEP: ${data.address.zip}
- **Tipo de Imóvel:** ${data.property_type}
- **Área do Terreno:** ${data.land_area_m2 ? `${data.land_area_m2} m²` : 'Não informado'}
- **Área Construída:** ${data.built_area_m2 ? `${data.built_area_m2} m²` : 'Não informado'}
- **Idade da Construção:** ${data.construction_age_years ? `${data.construction_age_years} anos` : 'Não informado'}
- **Descrição da Conservação:** ${data.condition_description}
- **Documentos Apresentados:** ${data.documents.length > 0 ? data.documents.join(', ') : 'Nenhum'}
- **Situação Documental:** ${data.document_status}
- **Objetivo da Avaliação:** ${data.objective}
- **Ocupação:** ${data.occupancy}
- **Condomínio:** ${data.condominium || "N/A"}
- **Fotos:** ${data.photos.length > 0 ? `${data.photos.length} fotos fornecidas` : 'Nenhuma foto fornecida'}
- **Detalhes Adicionais:** ${data.additional_details || "Nenhum"}
  `;
};

export const generateTechnicalReport = async (data: PropertyData): Promise<string> => {
  const promptData = formatDataForPrompt(data);

  const prompt = `
    **Tarefa:** Atue como um avaliador de imóveis profissional e experiente, filiado ao CRECI e com registro no CNAI. Sua tarefa é elaborar um Parecer Técnico de Avaliação Mercadológica (PTAM) conciso e bem-estruturado com base nos dados fornecidos do imóvel.

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
         - Estado de Conservação: Com base na descrição, o estado de conservação é **[Analise a 'condition_description' e classifique como: Novo, Bom, Regular, Mau, Péssimo]**.
         - Descrição Sumária: ${data.condition_description}.

    **4. ANÁLISE DO MERCADO E METODOLOGIA**
       - **Metodologia:** Para a presente avaliação, foi utilizado o Método Comparativo Direto de Dados de Mercado, conforme preconiza a NBR 14.653 da ABNT.
       - **Análise da Região:** O imóvel está localizado no bairro ${data.address.neighborhood}, uma área [Descreva brevemente as características da região: residencial, comercial, mista, infraestrutura, etc.].
       - **Pesquisa de Mercado:** Foi realizada uma pesquisa de imóveis com características semelhantes na região. [Simule uma breve análise, mencionando que foram encontrados imóveis com valores entre X e Y, e que a média do m² na região é de Z].

    **5. CONCLUSÃO E VALOR DE MERCADO**
       - Com base nos dados coletados, na análise do mercado e nas características do imóvel avaliado, conclui-se que o valor de mercado estimado para o referido imóvel é de:
       - **VALOR SUGERIDO: R$ [Estime um valor monetário realista com base em todos os dados fornecidos, especialmente área, localização e condição].**
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
    - Preencha as seções entre colchetes **[...]** com análises plausíveis baseadas nos dados de entrada.
    - A estimativa de valor deve ser coerente com as informações fornecidas. Um imóvel maior, mais novo e em bom estado em uma cidade grande deve ter um valor mais alto.
    `;
    
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate report from Gemini API.");
  }
};
