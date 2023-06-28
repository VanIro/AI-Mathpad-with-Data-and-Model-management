import React, { useState } from "react";
import RatingSelect from "./ratings";
import "./Card.css";
import useAxios from "../auth/useAxios";
import { BACKEND_URL_updateImageLabel } from "../backend_urls";


const ImageCard = (props) => {
  const item = props.item;
  const axios_instance = useAxios();
  const [selectedRating, setSelectedRating] = useState(5);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editedLabel, setEditedLabel] = useState(item.image_label);
  let labelValue = editedLabel.trim();

  const handleSelect = (rating) => {
    console.log("Selected rating:", rating)
    setSelectedRating(rating);
    console.log(rating);
  };

  const handleEditButtonClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleLabelChange = (e) => {
    setEditedLabel(e.target.value);
  };


  const handleLabelSubmit = async (e) => {
    e.preventDefault();
    // console.log("Updated label:", editedLabel);
    
  if (labelValue !== null && labelValue !== undefined) {
    // Create the request payload
    const data = {
      image_label: labelValue
    };

    try {
      // Send the POST request to save the updated image label
      await axios_instance.post(`${BACKEND_URL_updateImageLabel}${item.id}`, data);

      console.log('Image label updated successfully');
      setIsPopupOpen(false);
    } catch (error) {
      console.log('Error updating image label:', error);
    }
  } else {
    console.log('Invalid image label');
  }
};


const extractImgUrl = (fullPath)=>{
  const retStr =window.location.origin + fullPath.slice(fullPath.indexOf('/media'));
  return retStr;
}

const imgUrl = extractImgUrl(item.image_file);

  return (
    <div className="imageCard">
      <div className="rating-display">{selectedRating}</div>
      <div className="image-display">
        <img
          src={imgUrl}
          alt={item.image_label}
        />
      </div>
        <p className="text-display">
          <math-field contentEditable="false" >{item.image_label}</math-field>
        </p>
      <p>Uploaded At: {item.uploaded_at}</p>
      <p>City: {item.city}</p>
      {/* <p>Country: {item.country}</p>
      <p>Creator: {item.creator}</p>
      <p>Exp Type: {item.exp_type}</p> */}
      <button className="submit edit-button" onClick={handleEditButtonClick}>
        Edit
      </button>
      <RatingSelect
        selectedRating={selectedRating}
        onSelectedRating={handleSelect}
      />

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <img
              className="popup-image"
              src={item.image_file.split("/").slice(3).join("/")}
              alt={item.image_label}
            />
            <div className="popup-form">
              <form>
                <label>
                  Image Label:
                  <div class="input-group">
                    <input
                      type="text"
                      value={editedLabel}
                      onChange={handleLabelChange}
                    />
                  </div>
                </label>
                <div className="popup-buttons">
                  <button
                    className="submit image-card-button"
                    onClick={handleLabelSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="submit image-card-cancel-button"
                    onClick={handlePopupClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;