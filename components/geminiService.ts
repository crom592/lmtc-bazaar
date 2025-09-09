import { GoogleGenAI, Modality } from "@google/genai";

// The API key MUST be available as process.env.API_KEY.
// The execution environment is expected to provide this.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductContent = async (
  base64ImageData: string,
  mimeType: string,
  productName: string,
  productDescription: string
): Promise<{ generatedImage: string; generatedText: string }> => {
  try {
    const prompt = `이 이미지를 LMTC 4기 선교여행 후원 온라인 바자회에 어울리는 멋진 판매용 상품 이미지로 만들어주고, 이 상품에 대한 매력적인 상세 설명을 200자 내외로 작성해줘. 상품명: ${productName}, 기존 상품 설명: ${productDescription}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Check for safety blocks or empty response
    if (!response.candidates || response.candidates.length === 0) {
      const blockReason = response.promptFeedback?.blockReason;
      if (blockReason) {
        console.error(`Gemini request blocked. Reason: ${blockReason}`, response.promptFeedback);
        throw new Error(`AI 콘텐츠 생성이 안전상의 이유로 차단되었습니다.`);
      }
      throw new Error("AI가 응답을 생성하지 못했습니다. 다시 시도해주세요.");
    }

    let generatedImage = '';
    let generatedText = '';

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        generatedImage = part.inlineData.data;
      } else if (part.text) {
        generatedText = part.text;
      }
    }

    // If no text was generated, provide a default.
    if (!generatedText) {
      generatedText = "AI가 생성한 설명을 가져오지 못했습니다.";
    }

    // If no image was generated, log a warning but do not throw an error.
    // The calling component will handle the case of an empty generatedImage string.
    if (!generatedImage) {
      console.warn("AI did not return an image part in the response.", response);
    }

    return { generatedImage, generatedText };
  } catch (error) {
    console.error("Error generating product content with Gemini:", error);
    // Re-throw a user-friendly message, keeping the original if it's already one of our custom errors.
    if (error instanceof Error && (error.message.includes('차단') || error.message.includes('응답을 생성하지'))) {
      throw error;
    }
    throw new Error("AI 콘텐츠 생성 중 오류가 발생했습니다. API 키를 확인하거나 다시 시도해주세요.");
  }
};
