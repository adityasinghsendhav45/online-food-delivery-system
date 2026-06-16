// import React, { useState, useContext } from 'react'; // Import useContext
// import { fetchRecipe } from '../../service/chefAIService';
// import { StoreContext } from '../../context/StoreContext'; // Import StoreContext
// import './ChefAI.css';

// const ChefAI = () => {
//     const { token } = useContext(StoreContext);
//     const [dishName, setDishName] = useState('');
//     const [recipe, setRecipe] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');

//     const handleGetRecipe = async (e) => {
//         e.preventDefault();
//         if (!dishName.trim()) {
//             setError('Please enter a dish name.');
//             return;
//         }
//         setIsLoading(true);
//         setError('');
//         setRecipe(null);
//         try {
//             const data = await fetchRecipe(dishName, token);
//             setRecipe(data);
//         } catch (err) {
//             setError('Could not fetch the recipe. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="container chef-ai-container py-5">
//             <div className="text-center mb-4">
//                 <h2>Welcome to ChefAI</h2>
//                 <p className="lead">Your personal AI-powered cooking assistant. What would you like to make today?</p>
//             </div>

//             <div className="row justify-content-center">
//                 <div className="col-md-8">
//                     <form onSubmit={handleGetRecipe} className="input-group mb-5">
//                         <input
//                             type="text"
//                             className="form-control"
//                             placeholder="e.g., Chicken Biryani, Paneer Butter Masala..."
//                             value={dishName}
//                             onChange={(e) => setDishName(e.target.value)}
//                         />
//                         <button className="btn btn-primary" type="submit" disabled={isLoading}>
//                             {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Get Recipe'}
//                         </button>
//                     </form>
//                 </div>
//             </div>

//             {error && <div className="alert alert-danger text-center">{error}</div>}

//             {recipe && (
//                 <div className="card recipe-card">
//                     <div className="card-body">
//                         <h3 className="card-title text-center mb-4">{dishName}</h3>
//                         <div className="row text-center mb-4 recipe-meta">
//                             <div className="col-md-4"><strong><i className="bi bi-clock"></i> Cooking Time:</strong> {recipe.cookingTime}</div>
//                             <div className="col-md-4"><strong><i className="bi bi-fire"></i> Calories:</strong> {recipe.calories}</div>
//                             <div className="col-md-4"><strong><i className="bi bi-egg-fried"></i> Diet:</strong> {recipe.dietType}</div>
//                         </div>

//                         <hr />

//                         <div className="row">
//                             <div className="col-md-5">
//                                 <h4>Ingredients</h4>
//                                 <ul className="list-group list-group-flush">
//                                     {recipe.ingredients.map((item, index) => (
//                                         <li key={index} className="list-group-item">{item}</li>
//                                     ))}
//                                 </ul>
//                             </div>
//                             <div className="col-md-7">
//                                 <h4>Instructions</h4>
//                                 <ol>
//                                     {recipe.instructions.map((step, index) => (
//                                         <li key={index} className="mb-2">{step}</li>
//                                     ))}
//                                 </ol>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ChefAI;



import React, { useState, useContext, useEffect, useRef } from 'react';
import { fetchRecipe } from '../../service/chefAIService';
import { downloadRecipePdf } from '../../service/chefAIService'; // Import the new service
import { StoreContext } from '../../context/StoreContext';
import './ChefAI.css';

const ChefAI = () => {
    const { token } = useContext(StoreContext);
    const [dishName, setDishName] = useState('');
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // State for Text-to-Speech
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const utteranceRef = useRef(null);

    const handleGetRecipe = async (e) => {
        e.preventDefault();
        // Stop any ongoing speech before fetching a new recipe
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        setIsSpeaking(false);
        setIsPaused(false);

        if (!dishName.trim()) {
            setError('Please enter a dish name.');
            return;
        }
        setIsLoading(true);
        setError('');
        setRecipe(null);
        try {
            const data = await fetchRecipe(dishName, token);
            setRecipe(data);
        } catch (err) {
            setError('Could not fetch the recipe. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPdf = async () => {
    // Check if there is a recipe to download
    if (!recipe) {
        setError('Please generate a recipe first.');
        return;
    }
    try {
        // Pass the dishName, the recipe object from state, and the token
        const blob = await downloadRecipePdf(dishName, recipe, token);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${dishName.replace(/\s+/g, '_')}_recipe.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        setError('Failed to download PDF. Please try again.');
    }
};

    const handleTextToSpeech = () => {
        if (!recipe || !recipe.instructions) return;

        if (isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
            return;
        }

        const recipeText = `Instructions for ${dishName}. ` + recipe.instructions.join('. ');
        const utterance = new SpeechSynthesisUtterance(recipeText);
        utteranceRef.current = utterance;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };
        utterance.onerror = () => {
             setError('An error occurred during speech synthesis.');
             setIsSpeaking(false);
             setIsPaused(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    const handlePauseSpeech = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsSpeaking(false);
    };

    const handleStopSpeech = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    // Cleanup speech synthesis on component unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);


    return (
        <div className="container chef-ai-container py-5">
            {/* ... (The top part of your component remains the same) ... */}
            <div className="text-center mb-4">
                <h2>Welcome to ChefAI</h2>
                <p className="lead">Your personal AI-powered cooking assistant. What would you like to make today?</p>
            </div>

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <form onSubmit={handleGetRecipe} className="input-group mb-5">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Chicken Biryani, Paneer Butter Masala..."
                            value={dishName}
                            onChange={(e) => setDishName(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit" disabled={isLoading}>
                            {isLoading ? <span className="spinner-border spinner-border-sm"></span> : 'Get Recipe'}
                        </button>
                    </form>
                </div>
            </div>


            {error && <div className="alert alert-danger text-center">{error}</div>}

            {recipe && (
                <div className="card recipe-card">
                    <div className="card-body">
                       {/* ... (The recipe details part remains the same) ... */}
                        <h3 className="card-title text-center mb-4">{dishName}</h3>
                        <div className="row text-center mb-4 recipe-meta">
                            <div className="col-md-4"><strong><i className="bi bi-clock"></i> Cooking Time:</strong> {recipe.cookingTime}</div>
                            <div className="col-md-4"><strong><i className="bi bi-fire"></i> Calories:</strong> {recipe.calories}</div>
                            <div className="col-md-4"><strong><i className="bi bi-egg-fried"></i> Diet:</strong> {recipe.dietType}</div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col-md-5">
                                <h4>Ingredients</h4>
                                <ul className="list-group list-group-flush">
                                    {recipe.ingredients.map((item, index) => (
                                        <li key={index} className="list-group-item">{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="col-md-7">
                                <h4>Instructions</h4>
                                <ol>
                                    {recipe.instructions.map((step, index) => (
                                        <li key={index} className="mb-2">{step}</li>
                                    ))}
                                </ol>
                            </div>
                        </div>

                         {/* Action Buttons */}
                        <div className="text-center mt-4">
                            <button className="btn btn-secondary me-2" onClick={handleDownloadPdf}>
                                <i className="bi bi-file-earmark-pdf"></i> Download PDF
                            </button>
                            {!isSpeaking && <button className="btn btn-info" onClick={handleTextToSpeech}>
                                <i className="bi bi-volume-up"></i> {isPaused ? 'Resume' : 'Read Aloud'}
                            </button>}
                            {isSpeaking && !isPaused && <button className="btn btn-warning me-2" onClick={handlePauseSpeech}>
                                <i className="bi bi-pause-circle"></i> Pause
                            </button>}
                            {(isSpeaking || isPaused) && <button className="btn btn-danger" onClick={handleStopSpeech}>
                                <i className="bi bi-stop-circle"></i> Stop
                            </button>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChefAI;