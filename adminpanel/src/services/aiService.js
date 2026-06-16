import axios from "axios";

const API_URL = 'http://localhost:8080/api/ai';

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