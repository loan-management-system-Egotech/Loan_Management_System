import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  label, 
  percentage, 
  textValue, 
  variant = 'primary' // 'primary'(blue), 'success'(green), 'warning'(orange), 'danger'(red)
}) => {
  return (
    <div className="progress-container">
      <div className="progress-header">
        <span className="progress-label">{label}</span>
        <span className="progress-text" style={{ color: `var(--color-${variant})` }}>
          {textValue || `${percentage}%`}
        </span>
      </div>
      
      <div className="progress-track">
        {/* The magic happens here: we use an inline style to set the width! */}
        <div 
          className={`progress-fill bg-${variant}`} 
          style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;