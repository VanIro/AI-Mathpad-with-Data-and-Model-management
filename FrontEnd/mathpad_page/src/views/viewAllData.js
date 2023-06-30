import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import useAxios from "../auth/useAxios";
import { BACKEND_URL_viewAllData } from "../backend_urls";

import ImageCard from "../components/Card";

import "./viewAllData.css";

const ViewAllData = () => {
  const axios_instance = useAxios();
  const { user } = useContext(AuthContext);
  const [allData, setAllData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  console.log('allData',allData);
  useEffect(() => {
    console.log('useEffect');
    handleViewAllData();
  },[]);

  const handleViewAllData = async () => {
    try {
      const response = await axios_instance.get(BACKEND_URL_viewAllData);
      setAllData(response.data);
    } catch (error) {
      console.log('handleViewAllData : ',error);
    }
  };

  const itemsPerPage = 6; // Number of items per page
  const totalPages = Math.ceil(allData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = allData.slice(startIndex, endIndex);



  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const renderData = () => {

    return currentData.map((item,i) => (
      <div key={i} className="card-container">
        <ImageCard item={item} setAllData={setAllData} />
      </div>
    ));
  }

  return (
    <div className="content-wrap">
      <h1>View all Images Here</h1>
      <div className="cards-container">

        {renderData()}
      </div>
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

export default ViewAllData;