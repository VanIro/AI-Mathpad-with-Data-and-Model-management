import React from "react";
import "./ratings.css";

const RatingSelect = ({ selectedRating, onSelectedRating, id_num }) => {
  const onChange = (e) => {
    const rating = Number(e.target.value);
    onSelectedRating(id_num, rating);
  };

  return (
    <ul className="rating">
      {[1, 2, 3, 4, 5].map((num, i) => {
        return (
          <li key={i}>
            <input
              type="radio"
              id={`num${i}_${id_num}`}
              name={`rating_${id_num}`}
              value={num}
              onChange={onChange}
              checked={selectedRating === num}
            />
            <label htmlFor={`num${i}_${id_num}`}>{num}</label>
          </li>
        );
      })}
    </ul>
  );
};

export default RatingSelect;
