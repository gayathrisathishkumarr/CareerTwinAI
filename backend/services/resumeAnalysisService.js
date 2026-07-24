import { GoogleGenAI, Type } from '@google/genai';

export class ResumeAnalysisService {
  /**
   * Main entry point to convert raw resume text to structured Career Twin JSON using Gemini AI
   */
  static async analyzeText(rawText = '') {
    if (!rawText || typeof rawText !== 'string') {
      return this.getEmptyProfile();
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn('⚠️ No GEMINI_API_KEY found in .env. Returning empty profile.');
      return this.getEmptyProfile();
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = 'gemini-2.5-flash';

      const prompt = `
        You are an expert HR and recruitment AI. Extract the following structured information from the provided resume text. 
        Ensure you thoroughly parse all sections and categorize skills appropriately. 
        If a field is missing, leave it as an empty string or empty array.
        
        Resume Text:
        """
        ${rawText}
        """
      `;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          personal: {
            type: Type.OBJECT,
            properties: {
              fullName: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              linkedIn: { type: Type.STRING },
              gitHub: { type: Type.STRING },
              portfolio: { type: Type.STRING }
            }
          },
          education: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                degree: { type: Type.STRING },
                institution: { type: Type.STRING },
                graduationYear: { type: Type.STRING }
              }
            }
          },
          skills: {
            type: Type.OBJECT,
            properties: {
              programmingLanguages: { type: Type.ARRAY, items: { type: Type.STRING } },
              frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
              libraries: { type: Type.ARRAY, items: { type: Type.STRING } },
              databases: { type: Type.ARRAY, items: { type: Type.STRING } },
              tools: { type: Type.ARRAY, items: { type: Type.STRING } },
              cloud: { type: Type.ARRAY, items: { type: Type.STRING } },
              softSkills: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          },
          experience: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                role: { type: Type.STRING },
                company: { type: Type.STRING },
                duration: { type: Type.STRING }
              }
            }
          },
          projects: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            }
          },
          certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
          achievements: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      };

      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        }
      });

      const structuredProfile = JSON.parse(response.text);
      return structuredProfile;
    } catch (error) {
      console.error('❌ Gemini API extraction failed:', error.message);
      // Fallback to empty profile
      return this.getEmptyProfile();
    }
  }

  static getEmptyProfile() {
    return {
      personal: { fullName: '', email: '', phone: '', linkedIn: '', gitHub: '', portfolio: '' },
      education: [],
      skills: {
        programmingLanguages: [],
        frameworks: [],
        libraries: [],
        databases: [],
        tools: [],
        cloud: [],
        softSkills: []
      },
      experience: [],
      projects: [],
      certifications: [],
      achievements: []
    };
  }
}
