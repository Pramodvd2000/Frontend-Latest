

// import React, { useState } from "react";

// const categories = [
//     "Overall Satisfaction",
//     "Overall Arrival Experience",
//     "Overall Room Experience",
//     "Overall Internet Experience",
//     "Quality of Food",
//     "Overall Food and Beverage Experience",
//     "Overall Sustainability Initiatives by the Hotel",
// ];

// // Define button styles for each rating
// const getButtonStyle = (index, isSelected) => {
//     // For Reactstrap buttons, we need to use the style prop for complete override
//     const bgColors = [
//         "#f56565", // red-500
//         "#ed8936", // orange-500
//         "#f6ad55", // orange-400
//         "#ecc94b", // yellow-400
//         "#faf089", // yellow-300
//         "#68d391", // green-400
//         "#48bb78", // green-500
//         "#38b2ac", // teal-500
//         "#319795", // teal-600
//         "#000000", // black
//     ];

//     const textColor = index === 9 ? "white" : "black";

//     return {
//         backgroundColor: bgColors[index],
//         color: textColor,
//         border: "none",
//         padding: "8px 12px",
//         borderRadius: "8px",
//         cursor: "pointer",
//         boxShadow: isSelected ? "0 0 0 2px black" : "none",
//         // Override all default styling from Bootstrap/Reactstrap
//         outline: "none",
//         width: "100%",
//         fontWeight: "normal",
//         textAlign: "center",
//         whiteSpace: "nowrap",
//         verticalAlign: "middle",
//         userSelect: "none",
//         transition: "color 0.15s ease-in-out, background-color 0.15s ease-in-out",
//         lineHeight: "1.5"
//     };
// };

// const RatingTable = ({filldata}) => {
//     const [ratings, setRatings] = useState({});
//     const [feedback, setFeedback] = useState("");
//     const [suggestions, setSuggestions] = useState("");

//     useEffect(() => {


//         fetchx(API_URL + `/getAddedFeedBackByID?reservationID=${filldata.id}`,)
//             .then((res) => res.json())
//             .then(postres => {
//                 setLogData(postres['data'])
//             }).catch((err) => {
//                 console.log(err)
//             })

//     }, []);


//     const handleRating = (category, value) => {
//         setRatings((prev) => ({ ...prev, [category]: value }));
//     };

//     // Custom Button component to completely override Reactstrap
//     const CustomButton = ({ index, isSelected, onClick, children }) => {
//         return (
//             <button
//                 style={getButtonStyle(index, isSelected)}
//                 onClick={onClick}
//                 type="button"
//             >
//                 {children}
//             </button>
//         );
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <table className="w-full border-collapse">
//                 <thead>
//                     <tr className="text-left bg-gray-100">
//                         <th className="p-3">Category</th>
//                         {[...Array(10)].map((_, i) => (
//                             <th key={i} className="p-3 text-center">{i + 1}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {categories.map((category) => (
//                         <tr key={category} className="border-b">
//                             <td className="p-3 bg-pink-100 font-bold"><b>{category}</b></td>
//                             {[...Array(10)].map((_, i) => (
//                                 <td key={i} className="p-2 text-center">
//                                     <CustomButton
//                                         index={i}
//                                         isSelected={ratings[category] === i + 1}
//                                         onClick={() => handleRating(category, i + 1)}
//                                     >
//                                         {i + 1}
//                                     </CustomButton>
//                                 </td>
//                             ))}
//                             <div className="mt-6 grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-gray-700 font-medium">Feedback</label>
//                                     <textarea
//                                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         rows="3"
//                                         value={feedback}
//                                         onChange={(e) => setFeedback(e.target.value)}
//                                         placeholder="Enter your feedback..."
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="block text-gray-700 font-medium">Suggestions</label>
//                                     <textarea
//                                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                         rows="3"
//                                         value={suggestions}
//                                         onChange={(e) => setSuggestions(e.target.value)}
//                                         placeholder="Enter your suggestions..."
//                                     />
//                                 </div>
//                             </div>
//                         </tr>
//                     ))}

//                 </tbody>
//             </table>


//         </div>
//     );
// };

// export default RatingTable;



// import React, { useState, useEffect } from "react";
// import API_URL from '../../../config'
// const categories = [
//     "Overall Satisfaction",
//     "Overall Arrival Experience",
//     "Overall Room Experience",
//     "Overall Internet Experience",
//     "Quality of Food",
//     "Overall Food and Beverage Experience",
//     "Overall Sustainability Initiatives by the Hotel",
// ];


// const getButtonStyle = (index, isSelected, isPreselected) => {
//     // console.log(index, isSelected, isPreselected)
//     const bgColors = [
//         "#f56565", "#ed8936", "#f6ad55", "#ecc94b", "#faf089",
//         "#68d391", "#48bb78", "#38b2ac", "#319795", "#0011FF"
//     ];

//     return {
//         backgroundColor: isPreselected ? "#000000" : bgColors[index],
//         color: isPreselected ? "white" : (index === 9 ? "black" : "black"),
//         border: "none",
//         padding: "8px 12px",
//         borderRadius: "8px",
//         cursor: "pointer",
//         boxShadow: isSelected ? "0 0 0 2px black" : "none",
//         outline: "none",
//         width: "100%",
//         fontWeight: "normal",
//         textAlign: "center",
//         transition: "color 0.15s ease-in-out, background-color 0.15s ease-in-out",
//         lineHeight: "1.5"
//     };
// };

// const RatingTable = ({data1}) => {
//     console.log(data1)
//     const [ratings, setRatings] = useState({});
//     const [feedback, setFeedback] = useState("");
//     const [suggestions, setSuggestions] = useState("");

//     useEffect(() => {
//         fetch(API_URL + `/getAddedFeedBackByID?reservationID=${data1.id}`)
//             .then((res) => res.json())
//             .then((postres) => {
//                 console.log(postres)
//                 if (postres && postres.data && postres.data.length > 0) {
//                     const feedbackData = postres.data[0]; // Assuming first entry
//                     const feedbackJSON = feedbackData.feedBackJSON || [];

//                     // Set initial ratings based on API response
//                     const initialRatings = feedbackJSON.reduce((acc, item) => {
//                         acc[item.name] = item.rating;
//                         return acc;
//                     }, {});
// console.log(initialRatings)
// console.log("Keys in Initial Ratings:", Object.keys(initialRatings));

//                     setRatings(initialRatings);
//                     setFeedback(feedbackData.feedBack || "");
//                     setSuggestions(feedbackData.suggesation || "");
//                 }
//             })
//             .catch((err) => console.log(err));
//     }, []);

//     const handleRating = (category, value) => {
//         setRatings((prev) => ({ ...prev, [category]: value }));
//     };

//     const CustomButton = ({ index, isSelected, isPreselected, onClick, children }) => (
//         <button
//             style={getButtonStyle(index, isSelected, isPreselected)}
//             onClick={onClick}
//             type="button"
//         >
//             {children}
//         </button>
//     );

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <table className="w-full border-collapse">
//                 <thead>
//                     <tr className="text-left bg-gray-100">
//                         <th className="p-3">Category</th>
//                         {[...Array(10)].map((_, i) => (
//                             <th key={i} className="p-3 text-center">{i + 1}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 {ratings && <tbody>
//                     {categories.map((category) => (
//                         <tr key={category} className="border-b">
//                             <td className="p-3 bg-pink-100 font-bold"><b>{category}</b></td>
//                             {[...Array(10)].map((_, i) => (
//                                 console.log(category, ratings, i + 1),
//                                 <td key={i} className="p-2 text-center">
//                                     <CustomButton
//                                         index={i}
//                                         isSelected={ratings[category] === i + 1}
//                                         isPreselected={ratings[category] === i + 1}

//                                         onClick={() => handleRating(category, i + 1)}
//                                     >
//                                         {i + 1}
//                                     </CustomButton>
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>}
//             </table>

//             <div className="mt-6 grid grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-gray-700 font-medium">Feedback</label>
//                     <textarea
//                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         rows="3"
//                         value={feedback}
//                         onChange={(e) => setFeedback(e.target.value)}
//                         placeholder="Enter your feedback..."
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-gray-700 font-medium">Suggestions</label>
//                     <textarea
//                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         rows="3"
//                         value={suggestions}
//                         onChange={(e) => setSuggestions(e.target.value)}
//                         placeholder="Enter your suggestions..."
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RatingTable;

















// import React, { useState, useEffect } from "react";
// import API_URL from '../../../config';

// const getButtonStyle = (index, isSelected, isPreselected) => {
//     const bgColors = [
//         "#f56565", "#ed8936", "#f6ad55", "#ecc94b", "#faf089",
//         "#68d391", "#48bb78", "#38b2ac", "#319795", "#0011FF"
//     ];

//     return {
//         backgroundColor: isPreselected ? "#000000" : bgColors[index % bgColors.length],
//         color: isPreselected ? "white" : "black",
//         border: "none",
//         padding: "8px 12px",
//         borderRadius: "8px",
//         cursor: "pointer",
//         boxShadow: isSelected ? "0 0 0 2px black" : "none",
//         outline: "none",
//         width: "100%",
//         fontWeight: "normal",
//         textAlign: "center",
//         transition: "color 0.15s ease-in-out, background-color 0.15s ease-in-out",
//         lineHeight: "1.5"
//     };
// };

// const RatingTable = ({ data1 }) => {
//     const [ratings, setRatings] = useState({});
//     const [feedback, setFeedback] = useState("");
//     const [suggestions, setSuggestions] = useState("");
//     const [categories, setCategories] = useState([]);

//     useEffect(() => {
//         fetch(API_URL + `/getAddedFeedBackByID?reservationID=${data1.id}`)
//             .then((res) => res.json())
//             .then((postres) => {
//                 console.log(postres);
//                 if (postres && postres.data && postres.data.length > 0) {
//                     const feedbackData = postres.data[0]; 
//                     const feedbackJSON = feedbackData.feedBackJSON || [];

//                     // Extract categories dynamically
//                     const categoryNames = feedbackJSON.map(item => item.name);
//                     setCategories(categoryNames);

//                     // Set initial ratings
//                     const initialRatings = feedbackJSON.reduce((acc, item) => {
//                         acc[item.name] = item.rating;
//                         return acc;
//                     }, {});

//                     setRatings(initialRatings);
//                     setFeedback(feedbackData.feedBack || "");
//                     setSuggestions(feedbackData.suggesation || "");
//                 }
//             })
//             .catch((err) => console.log(err));
//     }, [data1.id]);

//     const handleRating = (category, value) => {
//         setRatings((prev) => ({ ...prev, [category]: value }));
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <table className="w-full border-collapse">
//                 <thead>
//                     <tr className="text-left bg-gray-100">
//                         <th className="p-3">Category</th>
//                         {[...Array(10)].map((_, i) => (
//                             <th key={i} className="p-3 text-center">{i + 1}</th>
//                         ))}
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {categories.map((category) => (
//                         <tr key={category} className="border-b">
//                             <td className="p-3 bg-pink-100 font-bold"><b>{category}</b></td>
//                             {[...Array(10)].map((_, i) => (
//                                 <td key={i} className="p-2 text-center">
//                                     <button
//                                         style={getButtonStyle(i, ratings[category] === i + 1, ratings[category] === i + 1)}
//                                         // onClick={() => handleRating(category, i + 1)}
//                                         type="button"
//                                     >
//                                         {i + 1}
//                                     </button>
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <div className="mt-6 grid grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-gray-700 font-medium">Feedback</label>
//                     <textarea
//                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         rows="3"
//                         value={feedback}
//                         onChange={(e) => setFeedback(e.target.value)}
//                         placeholder="Enter your feedback..."
//                     />
//                 </div>
//                 <div>
//                     <label className="block text-gray-700 font-medium">Suggestions</label>
//                     <textarea
//                         className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         rows="3"
//                         value={suggestions}
//                         onChange={(e) => setSuggestions(e.target.value)}
//                         placeholder="Enter your suggestions..."
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default RatingTable;




import React, { useState, useEffect } from "react";
import API_URL from '../../../config';
import { Card, CardHeader, CardTitle, CardBody, CardText, Input } from 'reactstrap'

const getButtonStyle = (index, isSelected, isPreselected) => {
    const bgColors = [
        "#f56565", "#ed8936", "#f6ad55", "#ecc94b", "#faf089",
        "#6BDA70", "#66BB6A", "#20A326", "#67C3BA", "#0EA597"
    ];

    return {
        backgroundColor: isPreselected ? "#000000" : bgColors[index],
        color: isPreselected ? "white" : "black",
        border: "none",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        boxShadow: isSelected ? "0 0 0 2px black" : "none",
        outline: "none",
        width: "100%",
        fontWeight: "normal",
        textAlign: "center",
        transition: "color 0.15s ease-in-out, background-color 0.15s ease-in-out",
        lineHeight: "1.5"
    };
};

const RatingTable = ({ data1 }) => {
    const [ratings, setRatings] = useState({});
    const [categories, setCategories] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [suggestions, setSuggestions] = useState("");

    useEffect(() => {
        fetch(API_URL + `/getAddedFeedBackByID?reservationID=${data1.id}`)
            .then((res) => res.json())
            .then((postres) => {
                if (postres && postres.data && postres.data.length > 0) {
                    const feedbackData = postres.data[0];
                    const feedbackJSON = feedbackData.feedBackJSON || [];

                    const categoryNames = feedbackJSON.map(item => item.name);
                    setCategories(categoryNames);

                    const initialRatings = feedbackJSON.reduce((acc, item) => {
                        acc[item.name] = item.rating;
                        return acc;
                    }, {});

                    setRatings(initialRatings);
                    setFeedback(feedbackData.feedBack || "");
                    setSuggestions(feedbackData.suggesation || "");
                }
            })
            .catch((err) => console.log(err));
    }, [data1.id]);

    const handleRating = (category, value) => {
        setRatings((prev) => ({ ...prev, [category]: value }));
    };

    const CustomButton = ({ index, isSelected, isPreselected, onClick, children }) => (
        <button
            style={getButtonStyle(index, isSelected, isPreselected)}
            onClick={onClick}
            type="button"
        >
            {children}
        </button>
    );

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="text-left bg-gray-100">
                        <th className="p-3">Category</th>
                        {[...Array(10)].map((_, i) => (
                            <th key={i} className="p-3 text-center">{i + 1}</th>
                        ))}
                        <th className="p-3 text-left">Feedback & Suggestions</th>
                    </tr>
                </thead>
                {ratings && (
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category} className="border-b">
                                <td className="p-3 bg-pink-100 font-bold">
                                    <b>{category}</b>
                                </td>
                                {[...Array(10)].map((_, i) => (
                                    <td key={i} className="p-2 text-center">
                                        <CustomButton
                                            index={i}
                                            isSelected={ratings[category] === i + 1}
                                            isPreselected={ratings[category] === i + 1}
                                        // onClick={() => handleRating(category, i + 1)}
                                        >
                                            {i + 1}
                                        </CustomButton>
                                    </td>
                                ))}
                                {category === categories[0] && (
                                    <td rowSpan={categories.length} className="p-3 align-top"style={{ width: "26%" }}>
                                        <div className="mb-4">
                                            {/* <label className="block text-gray-900 font-semibold mb-2">Feedback</label>
                                            <textarea
                                                className="w-full p-3 border-2 border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                rows="3"
                                                value={feedback}
                                                onChange={(e) => setFeedback(e.target.value)}
                                                placeholder="Enter your feedback..."
                                            /> */}
                                            <CardText>
                                                <b>Feedback</b>
                                            </CardText>
                                            <Input type='textarea' name='text' id='exampleText' rows='3' value={feedback} placeholder='Enter your feedback...'            disabled
                                            />
                                        </div>
                                        <div className="mb-4">
                                            {/* <label className="block text-gray-900 font-semibold mb-2">Suggestions</label>
                                            <textarea
                                                className="w-full p-3 border-2 border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                rows="3"
                                                value={suggestions}
                                                onChange={(e) => setSuggestions(e.target.value)}
                                                placeholder="Enter your suggestions..."
                                            /> */}
                                            <CardText>
                                                <b>Suggestions</b>
                                            </CardText>
                                            <Input type='textarea' name='text' id='Suggestions' rows='3'  value={suggestions} placeholder='Enter your suggestions...'  disabled/>
                                        </div>


                                    </td>
                                )}

                            </tr>
                        ))}
                    </tbody>
                )}
            </table>
        </div>
    );
};

export default RatingTable;
