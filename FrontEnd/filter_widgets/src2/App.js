import React, { useState } from "react";
import DataSetCard from "./DataSetCard";
import "./viewDataSets.css";

const App = () => {
  const DatasetsList = JSON.parse(
    document.getElementById("datasets-list").innerHTML
  );
  const totalPages = Math.ceil(DatasetsList.length / 6);

  const [currentPage, setCurrentPage] = useState(1);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const renderData = () => {
    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;
    const pageData = DatasetsList.slice(startIndex, endIndex);

    return pageData.map((item, index) => (
      <div key={index} className="card-container">
        <DataSetCard item={item} />
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
