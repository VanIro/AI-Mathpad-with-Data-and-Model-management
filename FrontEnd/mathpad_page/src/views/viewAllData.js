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

  useEffect(() => {
    handleViewAllData();
  }, []);

  const handleViewAllData = async () => {
    try {
      const response = await axios_instance.get(BACKEND_URL_viewAllData);
      setAllData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const renderData = () => {
  //   return allData.map((item) => (
  //     <ImageCard item={item} />
  //   ));
  // };

  const renderData = () => {
  const itemsPerRow = 3; // Number of items per row
  const rows = Math.ceil(allData.length / itemsPerRow);

  const imageRows = [];
  for (let i = 0; i < rows; i++) {
    const startIndex = i * itemsPerRow;
    const endIndex = startIndex + itemsPerRow;
    const rowItems = allData.slice(startIndex, endIndex);

    const imageRow = rowItems.map((item) => (
      <ImageCard key={item.id} item={item} />
    ));

    imageRows.push(
      <div key={i} className="imageRow">
        {imageRow}
      </div>
    );
  }

  return imageRows;
}

  return (
    <div className="content-wrap">
      <h1>View all Images Here</h1>
      {renderData()}
    </div>
  );
};

export default ViewAllData;