import axios from "axios";

const API_URL = "https://foodies-backend-production-edc1.up.railway.app/api/ai";

export const getRecommendations = async (token) => {
    try {
        const response = await axios.get(
            `${API_URL}/recommendations`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error fetching recommendations", error);
        throw error;
    }
};