import React from 'react'
import _ from 'lodash'

import './Row.css'

const Row = ({ filterQuery, data }) => {
  const rgx = new RegExp(filterQuery, 'gi')

  const match = rgx.test(data.description)
    ? filterQuery.length > 0 ? 'matched' : ''
    : 'not-matched'

  const type = data.amount < 0 ? 'debito' : 'credito'

  return (
    <div className={`row ${match}`}>
      <div className="date">
        <div>{data.dateInitiated}</div>
        <div className="small">
          {data.dateValue}
        </div>
      </div>
      <div className="description">
        {data.description}
      </div>
      <div className={`amount ${type}`}>
        <div>{_.round(data.amount, 2).toFixed(2)}</div>
        <div className="small">
          {_.round(data.balance, 2).toFixed(2)}
        </div>
      </div>
    </div>
  )
}

export default Row
