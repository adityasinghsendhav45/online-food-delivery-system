// import React, { useState } from 'react';
// import {assets} from '../../assets/assets';
// import axios from 'axios';
// import { addFood } from '../../services/foodService';
// import { toast } from 'react-toastify';

// const AddFood = () => {
//     const [image, setImage] = useState(false);
//     const [data, setData] = useState({
//         name:'',
//         description: '',
//         price:'',
//         category: 'Biryani'
//     });

//     const onChangeHandler = (event) => {
//         const name = event.target.name;
//         const value = event.target.value;
//         setData(data => ({...data, [name]: value}));
//     }

//     const onSubmitHandler = async (event) => {
//         event.preventDefault();
//         if (!image) {
//             toast.error('Please select an image.');
//             return;
//         }
//         try {
//             await addFood(data, image);
//             toast.success('Food added successfully.');
//             setData({name: '', description: '', category: 'Biryani', price: ''});
//             setImage(null);
//         } catch (error) {
//             toast.error('Error adding food.');
//         }
//     }
//   return (
//     <div className="mx-2 mt-2">
//   <div className="row">
//     <div className="card col-md-4">
//       <div className="card-body">
//         <h2 className="mb-4">Add Food</h2>
//         <form onSubmit={onSubmitHandler}>
//         <div className="mb-3">
//             <label htmlFor="image" className="form-label">
//                 <img src={image ? URL.createObjectURL(image): assets.upload} alt="" width={98} />
//             </label>
//             <input type="file" className="form-control" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
//           </div>
//           <div className="mb-3">
//             <label htmlFor="name" className="form-label">Name</label>
//             <input type="text" placeholder='Chicken Biryani' className="form-control" id="name" required name='name' onChange={onChangeHandler} value={data.name}/>
//           </div>
          
//           <div className="mb-3">
//             <label htmlFor="description" className="form-label">Description</label>
//             <textarea className="form-control" placeholder='Write content here...' id="description" rows="5" required name='description' onChange={onChangeHandler} value={data.description}></textarea>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="category" className="form-label">Category</label>
//             <select name="category" id="category" className='form-control' onChange={onChangeHandler} value={data.category}>
//                 <option value="Biryani">Biryani</option>
//                 <option value="Cake">Cake</option>
//                 <option value="Burger">Buger</option>
//                 <option value="Pizza">Pizza</option>
//                 <option value="Rolls">Rolls</option>
//                 <option value="Salad">Salad</option>
//                 <option value="Ice cream">Ice cream</option>
//             </select>
//           </div>
//           <div className="mb-3">
//             <label htmlFor="price" className="form-label">Price</label>
//             <input type="number" name="price" id="price" placeholder='&#8377;200' className='form-control' onChange={onChangeHandler} value={data.price} />
//           </div>
//           <button type="submit" className="btn btn-primary">Save</button>
//         </form>
//       </div>
//     </div>
//   </div>
// </div>
//   )
// }

// export default AddFood;








import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { addFood } from '../../services/foodService';
import { toast } from 'react-toastify';
import { generateSuggestions } from '../../services/aiService'; // Import the new AI service
import SuggestionsModal from '../../components/SuggestionsModal/SuggestionsModal'; // Import the modal
import TagInput from '../../components/TagInput/TagInput'; // Import the tag component

const AddFood = () => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Biryani'
    });
    // New state variables for the AI feature
    const [tags, setTags] = useState([]);
    const [keywords, setKeywords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    // Function to handle the "Generate with AI" button click
    const handleGenerateClick = async () => {
        if (!data.name) {
            toast.error("Please enter a food name first.");
            return;
        }
        setIsLoading(true);
        setShowModal(true);
        try {
            const response = await generateSuggestions(data.name, data.category);
            setSuggestions(response.descriptions);
            setTags(response.tags);
            setKeywords(response.keywords);
        } catch (error) {
            toast.error("Failed to get AI suggestions. Please try again.");
            setShowModal(false); // Close modal on error
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle selecting a description from the modal
    const handleSelectSuggestion = (description) => {
        setData(prevData => ({ ...prevData, description: description }));
        setShowModal(false);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        if (!image) {
            toast.error('Please select an image.');
            return;
        }

        // Include tags and keywords in the food data payload
        const foodDataWithTags = {
            ...data,
            tags: tags,
            keywords: keywords,
        };

        try {
            await addFood(foodDataWithTags, image);
            toast.success('Food added successfully.');
            // Reset all state
            setData({ name: '', description: '', category: 'Biryani', price: '' });
            setTags([]);
            setKeywords([]);
            setImage(null);
        } catch (error) {
            toast.error('Error adding food.');
        }
    };

    return (
        <>
            <SuggestionsModal
                show={showModal}
                onClose={() => setShowModal(false)}
                suggestions={suggestions}
                onSelect={handleSelectSuggestion}
                onRegenerate={handleGenerateClick} // Regenerate button calls the same function
                isLoading={isLoading}
            />

            <div className="mx-2 mt-2">
                <div className="row">
                    <div className="card col-md-5"> {/* Increased width to col-md-5 */}
                        <div className="card-body">
                            <h2 className="mb-4">Add Food</h2>
                            <form onSubmit={onSubmitHandler}>
                                <div className="mb-3">
                                    <label htmlFor="image" className="form-label">
                                        <img src={image ? URL.createObjectURL(image) : assets.upload} alt="" width={98} />
                                    </label>
                                    <input type="file" className="form-control" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input type="text" placeholder='Chicken Biryani' className="form-control" id="name" required name='name' onChange={onChangeHandler} value={data.name} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label d-flex justify-content-between align-items-center">
                                        <span>Description</span>
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={handleGenerateClick}
                                            disabled={isLoading}
                                            style={{ '--bs-btn-padding-y': '.2rem', '--bs-btn-padding-x': '.4rem', '--bs-btn-font-size': '.75rem' }}
                                        >
                                            {isLoading && !showModal ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                <span><i className="bi bi-magic"></i> Generate with AI</span>
                                            )}
                                        </button>
                                    </label>
                                    <textarea className="form-control" placeholder='Write content here or generate with AI...' id="description" rows="5" required name='description' onChange={onChangeHandler} value={data.description}></textarea>
                                </div>

                                {/* Displaying the TagInput component */}
                                {tags.length > 0 && (
                                  <div className="mb-3">
                                    <label className="form-label">Suggested Tags</label>
                                    <TagInput tags={tags} setTags={setTags} />
                                  </div>
                                )}
                                
                                <div className="mb-3">
                                    <label htmlFor="category" className="form-label">Category</label>
                                    <select name="category" id="category" className='form-control' onChange={onChangeHandler} value={data.category}>
                                        <option value="Biryani">Biryani</option>
                                        <option value="Cake">Cake</option>
                                        <option value="Burger">Burger</option>
                                        <option value="Pizza">Pizza</option>
                                        <option value="Rolls">Rolls</option>
                                        <option value="Salad">Salad</option>
                                        <option value="Ice cream">Ice cream</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input type="number" name="price" id="price" placeholder='₹200' className='form-control' onChange={onChangeHandler} value={data.price} />
                                </div>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddFood;