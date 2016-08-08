import React, { Component, PropTypes } from 'react';
import titleize from 'titleize';

export default class GraphSettingsForm extends Component {

  render() {
    return (
      <div id="oligrapherSettingsForm" className="accordionMenuForm">
        { Object.keys(this.props.settings).map(key => 
          <div key={key}>
            {titleize(key.replace(/[_-]+/, " "))}&nbsp;
            <input 
              ref={key}
              name={key}
              type="checkbox" 
              checked={this.props.settings[key]} 
              onChange={(event) => this.handleChange(event)} />
          </div>
        ) }
        <button 
          id="oligrapherSaveButton" 
          className="btn btn-sm btn-default"
          onClick={this.props.save}>
          Save
        </button>
      </div>
    );
  }

  handleChange(event) {
    let key = event.target.name;
    let value = event.target.checked;
    this.props.updateSettings({ [key]: value });
  }
}