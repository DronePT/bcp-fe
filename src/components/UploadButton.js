import React, { Component } from 'react'
import './UploadButton.css'

class UploadButton extends Component {
  handleButtonClick () {
    // console.log('button click?!', this.refs.file)
    this.refs.file.click()
  }

  handleFileChange (event) {
    this.props.onChange(event.target.files)
  }

  render () {
    const { children } = this.props

    return (
      <div className="upload-button">
        <button
          onClick={this.handleButtonClick.bind(this)}>{children}</button>
        <input
          ref="file"
          type="file"
          name="file"
          id="file"
          onChange={this.handleFileChange.bind(this)} />
      </div>
    )
  }
}

export default UploadButton
