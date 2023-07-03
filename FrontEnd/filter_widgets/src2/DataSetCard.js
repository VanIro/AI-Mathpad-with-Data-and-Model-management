import React, { useEffect, useState } from "react";

import "./DataSetCard.css";

const DataSetCard = (props) => {
  const item = props.item;

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  let [editedLabel, setEditedLabel] = useState(item.description);

  const handleEditButtonClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleLabelSubmit = (event) => {
    event.preventDefault();
    item.description = editedLabel;
    setIsPopupOpen(false);
  };

  useEffect(() => {
    setEditedLabel(item.description);
  }, [item.description]);

  const handleLabelChange = (event) => {
    setEditedLabel(event.target.value);
  };

  return (
    <div className="imageCard">
      <h4 className="item-name">{item.name}</h4>
      <div className="item-desc">{item.description}</div>
      <button className="submit edit-button" onClick={handleEditButtonClick}>
        Edit
      </button>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3 className="popup-text">{item.name}</h3>
            <div className="popup-form">
              <form>
                <label>
                  Image Description:
                  <div className="input-group">
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

export default DataSetCard;
