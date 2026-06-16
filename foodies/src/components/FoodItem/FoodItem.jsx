import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import './FoodItem.css'; // Make sure to import the CSS

const FoodItem = ({ name, id, imageUrl, price }) => {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);
  const itemCount = quantities[id] || 0;

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div className="food-item-card">
        <Link to={`/food/${id}`}>
          <img
            src={imageUrl}
            className="card-img-top"
            alt={name}
          />
        </Link>
        <div className="food-item-body text-center">
          <h5 className="food-item-title">{name}</h5>
          <p className="food-item-price">&#8377;{price}</p>
        </div>
        <div className="food-item-footer">
          <Link className="btn btn-outline-primary btn-sm" to={`/food/${id}`}>
            View Details
          </Link>
          {itemCount === 0 ? (
            <button
              className="btn btn-primary btn-sm"
              onClick={() => increaseQty(id)}
            >
              <i className="bi bi-cart-plus"></i> Add
            </button>
          ) : (
            <div className="quantity-stepper">
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => decreaseQty(id)}
              >
                <i className="bi bi-dash"></i>
              </button>
              <span className="item-count">{itemCount}</span>
              <button
                className="btn btn-outline-success btn-sm"
                onClick={() => increaseQty(id)}
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;





// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { StoreContext } from "../../context/StoreContext";

// const FoodItem = ({ name, description, id, imageUrl, price }) => {
//   const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);

//   return (
//     <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
//       <div className="card" style={{ maxWidth: "320px" }}>
//         <Link to={`/food/${id}`}>
//           <img
//             src={imageUrl}
//             className="card-img-top"
//             alt="Product Image"
//             height={300}
//             width={60}
//           />
//         </Link>
//         <div className="card-body">
//           <h5 className="card-title">{name}</h5>
//           <p className="card-text">{description}</p>
//           <div className="d-flex justify-content-between align-items-center">
//             <span className="h5 mb-0">&#8377;{price}</span>
//             <div>
//               <i className="bi bi-star-fill text-warning"></i>
//               <i className="bi bi-star-fill text-warning"></i>
//               <i className="bi bi-star-fill text-warning"></i>
//               <i className="bi bi-star-fill text-warning"></i>
//               <i className="bi bi-star-half text-warning"></i>
//               <small className="text-muted">(4.5)</small>
//             </div>
//           </div>
//         </div>
//         <div className="card-footer d-flex justify-content-between bg-light">
//           <Link className="btn btn-success btn-sm" to={`/food/${id}`}>
//             View Food
//           </Link>
//           {quantities[id] > 0 ? (
//             <div className="d-flex align-items-center gap-2">
//               <button
//                 className="btn btn-danger btn-sm"
//                 onClick={() => decreaseQty(id)}
//               >
//                 <i className="bi bi-dash-circle"></i>
//               </button>
//               <span className="fw-bold">{quantities[id]}</span>
//               <button
//                 className="btn btn-success btn-sm"
//                 onClick={() => increaseQty(id)}
//               >
//                 <i className="bi bi-plus-circle"></i>
//               </button>
//             </div>
//           ) : (
//             <button
//               className="btn btn-primary btn-sm"
//               onClick={() => increaseQty(id)}
//             >
//               <i className="bi bi-plus-circle"></i>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FoodItem;
















// <--------------------------------------------------------------------------------------------------------------------------------
// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { StoreContext } from "../../context/StoreContext";

// const FoodItem = ({ name, description, id, imageUrl, price }) => {
//   const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);

//   return (
//     <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
//       <div className="card" style={{ maxWidth: "320px" }}>
//         <Link to={`/food/${id}`}>
//           <img
//             src={imageUrl}
//             className="card-img-top"
//             alt="Product Image"
//             height={300}
//             width={60}
//           />
//         </Link>
//         <div className="card-body">
//           <div className="d-flex justify-content-between align-items-center">
//             <h5 className="card-title mb-0">{name}</h5>
//             <span className="h5 mb-0">&#8377;{price}</span>
//           </div>
//         </div>
//         <div className="card-footer d-flex justify-content-between bg-light">
//           <Link className="btn btn-success btn-sm" to={`/food/${id}`}>
//             View Food
//           </Link>
//           {quantities[id] > 0 ? (
//             <div className="d-flex align-items-center gap-2">
//               <button
//                 className="btn btn-danger btn-sm"
//                 onClick={() => decreaseQty(id)}
//               >
//                 <i className="bi bi-dash-circle"></i>
//               </button>
//               <span className="fw-bold">{quantities[id]}</span>
//               <button
//                 className="btn btn-success btn-sm"
//                 onClick={() => increaseQty(id)}
//               >
//                 <i className="bi bi-plus-circle"></i>
//               </button>
//             </div>
//           ) : (
//             <button
//               className="btn btn-primary btn-sm"
//               onClick={() => increaseQty(id)}
//             >
//               <i className="bi bi-plus-circle"></i>
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FoodItem;



// <----------------------------------------------------------------------------------------------------------------------------------

// import React, { useContext } from "react";
// import { Link } from "react-router-dom";
// import { StoreContext } from "../../context/StoreContext";

// const FoodItem = ({ name, id, imageUrl, price }) => {
//   const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);

//   return (
//     <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
//       <div
//         className="card shadow-lg border-0 rounded-3"
//         style={{
//           maxWidth: "320px",
//           transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
//           cursor: "pointer",
//         }}
//         onMouseEnter={(e) => {
//           e.currentTarget.style.transform = "scale(1.03)";
//           e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.3)";
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.transform = "scale(1)";
//           e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
//         }}
//       >
//         {/* Product Image */}
//         <Link to={`/food/${id}`}>
//           <img
//             src={imageUrl}
//             className="card-img-top rounded-top"
//             alt="Food"
//             style={{
//               height: "220px",
//               objectFit: "cover",
//               borderTopLeftRadius: "10px",
//               borderTopRightRadius: "10px",
//             }}
//           />
//         </Link>

//         {/* Card Body */}
//         <div className="card-body text-center">
//           <h5 className="card-title fw-bold text-dark">{name}</h5>
//           <h5 className="text-success fw-semibold mb-3">₹{price}</h5>
//         </div>

//         {/* Footer */}
//         <div className="card-footer bg-light border-0 d-flex justify-content-between align-items-center px-3 pb-3">
//           <Link
//             className="btn btn-outline-primary btn-sm fw-semibold"
//             to={`/food/${id}`}
//           >
//             View Details
//           </Link>

//           {quantities[id] > 0 ? (
//             <div className="d-flex align-items-center gap-2">
//               <button
//                 className="btn btn-danger btn-sm rounded-circle"
//                 style={{ width: "32px", height: "32px" }}
//                 onClick={() => decreaseQty(id)}
//               >
//                 <i className="bi bi-dash"></i>
//               </button>
//               <span className="fw-bold fs-6">{quantities[id]}</span>
//               <button
//                 className="btn btn-success btn-sm rounded-circle"
//                 style={{ width: "32px", height: "32px" }}
//                 onClick={() => increaseQty(id)}
//               >
//                 <i className="bi bi-plus"></i>
//               </button>
//             </div>
//           ) : (
//             <button
//               className="btn btn-primary btn-sm fw-semibold"
//               style={{ padding: "5px 15px" }}
//               onClick={() => increaseQty(id)}
//             >
//               <i className="bi bi-cart-plus me-1"></i> Add
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FoodItem;
