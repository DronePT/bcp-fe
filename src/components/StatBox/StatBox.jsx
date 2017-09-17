import React from 'react'
import './StatBox.css'

const StatBox = ({ icon, value }) => {
  return (
    <div className="stat-box">
      <div className="icon-container">
        <i
          className={`fa fa-${icon}`}
          aria-hidden="true"></i>
      </div>

      <span>{value}</span>
    </div>
  )
}

export default StatBox
