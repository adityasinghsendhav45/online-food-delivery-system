import axios from "axios";

const API_URL = 'http://localhost:8080/api/ai';

export const fetchRecipe = async (dishName, token) => {
    try {
        const response = await axios.get(`${API_URL}/recipe`, {
            params: { dishName },
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        throw error;
    }
};

export const downloadRecipePdf = async (dishName, recipe, token) => {
    try {
        // Change to axios.post
        const response = await axios.post(`http://localhost:8080/api/ai/recipe/pdf`, 
            recipe, // The recipe object is now the request body
            {
                params: { dishName }, // dishName is still a URL parameter
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error downloading recipe PDF:', error);
        throw error;
    }
};