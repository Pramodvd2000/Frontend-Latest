import React, { useState } from "react";
import { FaUser, FaRegEnvelope, FaStar } from "react-icons/fa";
import API_URL from '../../../config';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
import { useNavigate } from "react-router-dom";


const FeedbackForm = ({ isOpen, onClose }) => {
  let navigate = useNavigate();

  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comments: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Submitted:", formData); 
  
    const cartData = {
      hotelID: 1,
      storeID: sessionStorage.getItem('storeID'),
      name: formData.name, 
      email: formData.email, 
      phoneNumber: sessionStorage.getItem('mobileNumber'),
      foodRating: foodRating, 
      serviceRating: serviceRating, 
      comments: formData.comments, 
    };
  
    // console.log("cartData========", cartData);
  
    fetch(API_URL + '/addfeedback', {
      method: 'POST',
      body: JSON.stringify(cartData), 
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => res.json())
      .then((post) => {
        if ((post['statusCode'] === 200) || (post['statusCode'] === 200)) {
          // const swalInstance = MySwal.fire({
          //   text: 'Feedback Added!',
          //   icon: 'success',
          //   buttonsStyling: false,
          //   confirmButtonText: 'Close',
          //   customClass: {
          //     confirmButton: 'btn btn-danger',
          //   },
          // });
          const swalInstance = MySwal.fire({
            // title: 'Feedback Added!',
            title: post['message'],
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom',
              icon: 'swal2-icon-custom'
            },
            width: '300px',
            html: `
              <style>
                .swal2-popup-custom {
                  padding: 0.75rem !important;
                }
                .swal2-icon-custom {
                  margin: 0.5rem auto !important;
                  transform: scale(0.9) !important;
                }
                .swal2-title-custom {
                  font-size: 14px !important;
                  color: #333 !important;
                  margin: 0.5rem 0 !important;
                  padding: 0 !important;
                }
                .btn.btn-danger {
                  background-color: #dc3545;
                  color: white;
                  padding: 10px 18px;
                  border-radius: 4px;
                  margin-top: 0.5rem;
                  border: none;
                  cursor: pointer;
                  font-size: 14px;
                }
                .btn.btn-danger:hover {
                  background-color: #bb2d3b;
                }
                .swal2-html-container {
                  margin: 0.2rem 0 !important;
                }
              </style>
            `
          });
          
  
          // swalInstance.then((result) => {
          //   if (result.isConfirmed) {
          //     navigate('');
          //   }
          // });
        } else if ((post['statusCode'] === 403) || (post['statusCode'] === 403)) {
          // const swalInstance = MySwal.fire({
          //   text: 'Error adding Feedback!',
          //   icon: 'error',
          //   buttonsStyling: false,
          //   confirmButtonText: 'Close',
          //   customClass: {
          //     confirmButton: 'btn btn-danger',
          //   },
          // });
          const swalInstance = MySwal.fire({
            // title: 'Error adding Feedback!',
            title: post['message'],
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Close',
            customClass: {
              confirmButton: 'btn btn-danger',
              popup: 'swal2-popup-custom',
              title: 'swal2-title-custom',
              icon: 'swal2-icon-custom'
            },
            width: '300px',
            html: `
              <style>
                .swal2-popup-custom {
                  padding: 0.75rem !important;
                }
                .swal2-icon-custom {
                  margin: 0.5rem auto !important;
                  transform: scale(0.9) !important;
                }
                .swal2-title-custom {
                  font-size: 14px !important;
                  color: #333 !important;
                  margin: 0.5rem 0 !important;
                  padding: 0 !important;
                }
                .btn.btn-danger {
                  background-color: #dc3545;
                  color: white;
                  padding: 10px 18px;
                  border-radius: 4px;
                  margin-top: 0.5rem;
                  border: none;
                  cursor: pointer;
                  font-size: 14px;
                }
                .btn.btn-danger:hover {
                  background-color: #bb2d3b;
                }
                .swal2-html-container {
                  margin: 0.2rem 0 !important;
                }
              </style>
            `
          });
          swalInstance.then((result) => {
            if (result.isConfirmed) {
              // navigate(''); 
            }
          });
        }
      })
      .catch((error) => {
        // console.error('Error:', error);
        const swalInstance = MySwal.fire({
          text: 'An error occurred!',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Close',
          customClass: {
            confirmButton: 'btn btn-danger',
          },
        });
      });
  };
  

  const renderStars = (rating, setRating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        size={30}
        color={index < rating ? "#FFD700" : "#E0E0E0"}
        style={{ cursor: "pointer", marginRight: 10 }}
        onClick={() => setRating(index + 1)}
      />
    ));
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onClose}>
            &#8592;
          </button>
          <h2 style={styles.title}>Feedback Form</h2>
        </div>
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <FaRegEnvelope style={styles.icon} />
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.ratingGroup}>
            <p style={styles.label}>Please Rate the Food Quality</p>
            <div style={styles.stars}>{renderStars(foodRating, setFoodRating)}</div>
          </div>
          <div style={styles.ratingGroup}>
            <p style={styles.label}>Please Rate our Service</p>
            <div style={styles.stars}>{renderStars(serviceRating, setServiceRating)}</div>
          </div>
          <textarea
            name="comments"
            placeholder="Add your comments..."
            value={formData.comments}
            onChange={handleInputChange}
            style={styles.textarea}
          />
          <div style={styles.buttonGroup}>
            <button type="button" style={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    maxWidth: "500px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
    overflowY: "auto",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "24px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "20px 0",
  },
  form: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    color: "#ccc",
  },
  input: {
    width: "100%",
    padding: "10px 10px 10px 40px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
  },
  ratingGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  stars: {
    display: "flex",
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "14px",
    resize: "none",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop:'40px'
  },
  cancelButton: {
    flex: 1,
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
  },
  submitButton: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "#D32F2F",
    color: "#fff",
    cursor: "pointer",
  },
  header: {
    display: "flex",
    alignItems: "center",
    padding: "5px",
    borderBottom: "1px solid #E0E0E0",
    position: "sticky",
    top: 0,
    backgroundColor: "#FFF",
    zIndex: 1,
  },
  backButton: {
    background: "none",
    border: "none",
    fontSize: "25px",
    cursor: "pointer",
    marginRight: "10px",
    marginTop:'-5px'
  },
};


export default FeedbackForm;
