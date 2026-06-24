import axios from "axios";

const API_URL = "https://foodies-backend-production-edc1.up.railway.app/api/ai";

export const generateRecipe = async (dishName) => {
  const response = await axios.get(
    `${API_URL}/recipe?dishName=${dishName}`
  );
  return response.data;
};

export const downloadRecipePdf = async (dishName, recipe) => {
  const response = await axios.post(
    `${API_URL}/recipe/pdf?dishName=${dishName}`,
    recipe,
    {
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(
    new Blob([response.data])
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = `${dishName}_recipe.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
};