import axios from "axios";

const API_URL = 'https://foodies-backend-production-edc1.up.railway.app/api/ai';

export const generateSuggestions = async (foodName, category) => {
    try {
        const response = await axios.post(`${API_URL}/generate-suggestions`, { foodName, category });
        // The response.data will be the AiSuggestionResponse object { descriptions: [], tags: [], keywords: [] }
        return response.data;
    } catch (error) {
        console.error('Error generating suggestions:', error);
        throw error; // Re-throw the error to be handled by the component
    }
};