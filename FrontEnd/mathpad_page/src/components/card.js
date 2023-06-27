import React, { useState } from "react";
import RatingSelect from "./ratings";
import "./Card.css";

const ImageCard = (props) => {
  const item = props.item;

  const [selectedRating, setSelectedRating] = useState(5);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [editedLabel, setEditedLabel] = useState(item.image_label);

  const handleSelect = (rating) => {
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

  const handleLabelSubmit = (e) => {
    e.preventDefault();
    // Here, you can perform the necessary action to update the image label
    console.log("Updated label:", editedLabel);
    setIsPopupOpen(false);
  };

  return (
    <div className="imageCard">
      <div className="rating-display">{item.id}</div>
      <div className="image-display">
        <img
          src={item.image_file.split("/").slice(3).join("/")}
          alt={item.image_label}
        />
      </div>
      <p className="text-display">Image Label: {item.image_label}</p>
      <p>Uploaded At: {item.uploaded_at}</p>
      <p>City: {item.city}</p>
      <p>Country: {item.country}</p>
      <p>Creator: {item.creator}</p>
      <p>Exp Type: {item.exp_type}</p>
      <button className="submit" onClick={handleEditButtonClick}>
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
              src={item.image_file.split("/").slice(3).join("/")}
              alt={item.image_label}
            />
            <form onSubmit={handleLabelSubmit}>
              <label>
                Image Label:
                <input
                  type="text"
                  value={editedLabel}
                  onChange={handleLabelChange}
                />
              </label>
              <div className="popup-buttons">
                <button type="submit">Save</button>
                <button onClick={handlePopupClose}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;