import React, { Component } from 'react'
import moment from 'moment'
// import debounce from 'lodash/debounce'

// components
import Row from './components/Row'
import UploadButton from './components/UploadButton'
import StatBox from './components/StatBox/StatBox'
import Searches from './components/Searches/Searches'
import DatePicker from 'react-datepicker'

// assets
import logo from './mbcp.png'
import './App.css'
import 'react-datepicker/dist/react-datepicker.css'

class App extends Component {
  constructor () {
    super()

    this.state = {
      isUploading: false,
      filename: null,
      data: [],
      searches: [],
      filterQuery: '',
      startBalance: 0,
      startDate: moment(),
      endDate: moment(),
      minDate: moment(),
      maxDate: moment().add(10, 'days')
    }

    this.handleFileChange = this.handleFileChange.bind(this)
    this.handleFilterInput = this.handleFilterInput.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleSaveClick = this.handleSaveClick.bind(this)
    this.handleSearchRemove = this.handleSearchRemove.bind(this)

    this.setFilename = this.setFilename.bind(this)
    this.setResultTable = this.setResultTable.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  componentWillMount () {
    const { result, searches, filename } = localStorage

    if (result) {
      this.setResultTable(JSON.parse(result))
      this.setFilename ({ name: filename })()
    }

    if (searches) {
      this.setState({ searches: JSON.parse(searches) })
    }
  }

  handleSearchRemove (query) {
    const { searches } = this.state

    const newSearches = [].concat(searches)

    const index = newSearches.findIndex(q => q === query)

    newSearches.splice(index, 1)

    this.setState({ searches: newSearches })

    localStorage.searches = JSON.stringify(newSearches)
  }

  handleSaveClick (event) {
    event.preventDefault()

    const { filterQuery, searches } = this.state

    if (!filterQuery || filterQuery.length < 1) return

    searches.push(filterQuery)

    localStorage.searches = JSON.stringify(searches)

    this.setState({ searches })
  }

  handleDateChange (dateType) {
    return date => {
      this.setState({ [dateType]: date })
    }
  }

  handleFileChange (files) {
    this.setState({ isUploading: true })

    this.uploadFile(files[0])
  }

  handleFilterInput ({ target }) {
    const { value: filterQuery } = target

    this.setState({ filterQuery })
  }

  setFilename ({ name }) {
    return _ => {
      localStorage.filename = name
      this.setState({ filename: name })
    }
  }

  setResultTable (data) {
    localStorage.result = JSON.stringify(data)

    const total = data.length

    if (total <= 0) return

    const startBalance = data[total - 1].balance
    const minDate = moment(data[total - 1].dateValue, 'DD-MM-YYYY')
    const maxDate = moment(data[0].dateValue, 'DD-MM-YYYY')
    const startDate = minDate
    const endDate = maxDate

    this.setState({
      isUploading: false,
      data,
      minDate,
      maxDate,
      startDate,
      endDate,
      startBalance
    })
  }

  uploadFile (file) {
    const formData = new FormData()

    formData.append('file', file)

    fetch(
      'http://localhost:1337',
      { method: 'POST', body: formData }
    )
      .then(_ => _.json())
      .then(this.setResultTable)
      .then(this.setFilename(file))
      .catch(_ => console.warn('fail upload', _))
  }

  render() {
    const {
      data,
      searches,
      isUploading,
      filterQuery,
      startDate,
      endDate,
      minDate,
      maxDate,
      filename
    } = this.state

    const isInDateRange = ({ dateValue }) => (
      moment(dateValue, 'DD-MM-YYYY').isBetween(
        startDate, endDate, null, '[]'
      )
    )

    const result = data.filter(isInDateRange)

    let search = filterQuery
    try {
      new RegExp(search, 'gi')
    } catch (error) {
      search = ''
    }

    const isQueryMatch = ({ description }) => {
      const test = (new RegExp(search, 'gi')).test(description)
      return test
    }

    const resultFiltered = result.filter(isQueryMatch)
    const total = result.length
    const found = resultFiltered.length
    const startBalance = found > 0 ? (
      resultFiltered[found - 1].balance -
      resultFiltered[found - 1].amount
    ) : 0

    const sum = resultFiltered.reduce(
      (sum, { amount }) => sum + amount, 0
    )

    const calc = startBalance + sum

    return (
      <div className="App">
        <div className="App-header">
          <div className="logo-container">
            <img src={logo} alt="logo" />
          </div>

          <span>Millenium BCP - Graphs?!</span>
        </div>
        <div className="App-intro">
          <div className="form">
            <div className="uploader">
              {
                isUploading
                  ? null
                  : <UploadButton onChange={this.handleFileChange}>ENVIAR .CSV</UploadButton>
              }
              <span>{filename || 'Por favor envie um ficheiro .csv exportado do HomeBanking da MBCP'}</span>
            </div>

            <div className="searcher">
              <div className="datepicker">
                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  selected={startDate}
                  onChange={this.handleDateChange('startDate')}
                  minDate={minDate}
                  maxDate={maxDate}
                />

                <DatePicker
                  dateFormat="DD-MM-YYYY"
                  selected={endDate}
                  onChange={this.handleDateChange('endDate')}
                  minDate={minDate}
                  maxDate={maxDate}
                />
              </div>

              <div className="query">
                <input
                  type="text"
                  name="filterQuery"
                  id=""
                  value={filterQuery}
                  placeholder="Pesquise aqui..."
                  onInput={this.handleFilterInput} />
              </div>

              <div className="save">
                <button
                  onClick={this.handleSaveClick}>GUARDAR</button>
              </div>
            </div>
          </div>

          <div className="result">
            <div className="summary">
              <StatBox
                icon="list-ol"
                value={`${found} / ${total}`}
              />

              <StatBox
                icon="circle"
                value={`${startBalance.toFixed(2)} €`}
              />

              <StatBox
                icon="calculator"
                value={`${sum.toFixed(2)} €`}
              />

              <StatBox
                icon="eur"
                value={`${(calc).toFixed(2)} €`}
              />
            </div>

            <div className="pure-g">
              <div className="pure-u-2-3">
                <div className="rows-container">
                  {result.map((data, index) => <Row key={index} index={index} filterQuery={search} data={data} />)}
                </div>
              </div>

              <div className="pure-u-1-3">
                <Searches
                  data={result}
                  searches={searches}
                  onRemove={this.handleSearchRemove} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
