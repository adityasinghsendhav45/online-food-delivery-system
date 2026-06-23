import axios from "axios";

const API_URL = "http://localhost:8080/api/ai";

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