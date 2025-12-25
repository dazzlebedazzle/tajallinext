// src/components/CustomArrows.js

import React from 'react';

export const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: 'block'  }}
      onClick={onClick}
    />
  );
};

export const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{  display: 'block',fontFamily: 'slick',fontSize: "38px",color: "black"
       }}
      onClick={onClick}
    />
  );
};
