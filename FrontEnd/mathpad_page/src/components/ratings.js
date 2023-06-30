import React, { useState } from "react";
import "./ratings.css";

const RatingSelect = ({ selectedRating, onSelectedRating, id_num }) => {
  const onChange = (e) => {
    const rating = Number(e.target.value);
    onSelectedRating(rating);
  };
  console.log('rating select',selectedRating)
  return (
    <ul className="rating">
      {[1,2,3,4,5].map((num,i) => {
        console.log('rating select',num,selectedRating===num)
        return (
          <li key={i}>
            <input
              type="radio"
              id={`num${i}_${id_num}`}
              name="rating"
              value={num}
              onChange={onChange}
            />
            <label htmlFor={`num${i}_${id_num}`}>{num}</label>
          </li>
        );
      })}
    </ul>
  );
};

export default RatingSelect;