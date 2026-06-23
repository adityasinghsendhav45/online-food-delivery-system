import React, { useState } from "react";
import { generateRecipe, downloadRecipePdf } from "../../service/recipeService";

const RecipeGenerator = () => {
  const [dishName, setDishName] = useState("");
  const [recipe, setRecipe] = useState(null);

  const handleGenerate = async () => {
    try {
      const data = await generateRecipe(dishName);
      setRecipe(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>AI Recipe Generator</h2>

      <input
        type="text"
        className="form-control"
        placeholder="Enter Dish Name"
        value={dishName}
        onChange={(e) => setDishName(e.target.value)}
      />

      <button
        className="btn btn-primary mt-3"
        onClick={handleGenerate}
      >
        Generate Recipe
      </button>

      {recipe && (
        <div className="mt-4">

          <h4>Cooking Time</h4>
          <p>{recipe.cookingTime}</p>

          <h4>Calories</h4>
          <p>{recipe.calories}</p>

          <h4>Diet Type</h4>
          <p>{recipe.dietType}</p>

          <h4>Ingredients</h4>
          <ul>
            {recipe.ingredients?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>Instructions</h4>
          <ol>
            {recipe.instructions?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>

          <button
            className="btn btn-success"
            onClick={() => downloadRecipePdf(dishName, recipe)}
          >
            Download PDF
          </button>

        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;