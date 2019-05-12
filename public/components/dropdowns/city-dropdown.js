'use strict';
const e = React.createElement;

class CityDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cities: []
    }
  }

/**
    Function to get cities options
 */
  getCities() {
      console.log(this.props);
    return this.props.cities.map(function (city) {
        return (<option>{city}</option>)
    });
  }

  render() {
    return (
            <div className="state-dropdown">
                <label>Select City</label>
                <select className="selectpicker" placeholder="Select City">
                        {this.getCities}
                </select>
            </div>
    );
  }
}