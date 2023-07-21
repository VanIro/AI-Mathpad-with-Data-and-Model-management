import React, { useEffect, useState } from "react";

import "./DataSetCard.css";
import useAxios from "../../mathpad_page/src/auth/useAxios";

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

  const handleLabelSubmit = async (event) => {
    event.preventDefault();
    const data = {
      dataset_desc: editedLabel,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/updateDataset/${item.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        // Update the dataset in the DatasetsList state
        const updatedList = DatasetsList.map((listItem) =>
          listItem.id === item.id
            ? { ...listItem, description: editedLabel }
            : listItem
        );
        setDatasetsList(updatedList);
        setIsPopupOpen(false); // Close the popup after successful update
      } else {
        console.log("Frontend: Failed to update dataset description");
      }
    } catch (error) {
      console.log("Error:", error);
    }
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
