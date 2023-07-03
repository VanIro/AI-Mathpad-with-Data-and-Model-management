import React, { useState } from "react";
import DataSetCard from "./DataSetCard";
import "./viewDataSets.css";

const App = () => {
  const initialDatasetsList = JSON.parse(
    document.getElementById("datasets-list").innerHTML
  );
const itemsPerPage = 6;
  const totalPages = Math.ceil(initialDatasetsList.length / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(1);
  const [DatasetsList, setDatasetsList] = useState(initialDatasetsList);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const updateDatasetDescription = (updatedItem) => {
    const updatedList = DatasetsList.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setDatasetsList(updatedList);
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = DatasetsList.slice(startIndex, endIndex);

    return pageData.map((item, index) => (
      <div key={index} className="card-container">
        <DataSetCard item={item} updateDescription={updateDatasetDescription} />
      </div>
    ));
  };

  return (
    <div className="content-wrap">
      <h1>View all DataSets Here</h1>
      Page {currentPage} out of {totalPages} pages
      <div className="cards-container">{renderData()}</div>
      <div className="pagination">
        {currentPage > 1 && (
          <button
            className="submit navigation-button prev-button"
            onClick={handlePreviousPage}
          >
            Previous
          </button>
        )}
        {currentPage < totalPages && (
          <button
            className="submit navigation-button next-button"
            onClick={handleNextPage}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
