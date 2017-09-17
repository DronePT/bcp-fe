import React from 'react'
import _ from 'lodash'

import StatBox from './../StatBox/StatBox'
import './Search.css'

const Search = ({ data, query, onRemove }) => {
  const result = data.filter(
    ({ description }) => (new RegExp(query, 'gi')).test(description)
  )

  const count = result.length
  const sum = result.reduce((sum, { amount }) => sum + amount, 0)

  return (
    <div className="search-filter">
      <div className="sf-title">
        <span>{query}</span>
        <a href="/#" onClick={() => onRemove(query)}>
          <i className="fa fa-times"></i>
        </a>
      </div>

      <div className="sf-stats">
        <StatBox
          icon="list-ol"
          value={count}
        />

        <StatBox
          icon="list-ol"
          value={_.round(sum, 2).toFixed(2)}
        />
      </div>
    </div>
  )
}

const Searches = ({ data, searches, onRemove }) => {
  return (
    <div className="searches">
      {searches.map((query, i) => <Search
        key={i}
        data={data}
        onRemove={onRemove}
        query={query} />)}
    </div>
  )
}

export default Searches
