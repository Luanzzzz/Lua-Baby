import { GoogleGenAI, Modality } from "@google/genai";

// Initialize the client
// Ensure process.env.API_KEY is set in your environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTextContent = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Text Error:", error);
    throw error;
  }
};

export const editImageWithGemini = async (base64Image: string, prompt: string) => {
  try {
    // Clean base64 string if it contains headers
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/png', 
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && parts[0]?.inlineData) {
      return `data:image/png;base64,${parts[0].inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Edit Error:", error);
    throw error;
  }
};

export const generateVeoVideo = async (base64Image: string, prompt: string) => {
    try {
        // Note: Veo usually requires a key selection process in some environments, 
        // but here we assume standard API key usage via env var is sufficient for this server-side style call.
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            image: {
                imageBytes: cleanBase64,
                mimeType: 'image/png',
            },
            config: {
                numberOfVideos: 1,
                resolution: '720p', // Veo fast supports 720p
                aspectRatio: '16:9'
            }
        });

        // Poll for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUri) {
            // We need to fetch the actual video bytes because the URI is protected
            const videoUrlWithKey = `${videoUri}&key=${process.env.API_KEY}`;
            return videoUrlWithKey; 
        }
        return null;
    } catch (error) {
        console.error("Veo Video Generation Error:", error);
        throw error;
    }
}
