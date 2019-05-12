'use strict';
const selector = '#rating-charts';
const e = React.createElement;

class RatingCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedStates: [
      ]
    }
  }

  drawChart(state) {
      console.log('Draw chart!!');
  }

  getStates() {
    return this.state.states.map(function (state) {
        return <option value="{state.toLowerCase()}">{state}</option>
    });
  }

  getCities() {
      return ['Mumbai', 'Bangalore'];
  }

  render() {
    let cities = ['Mumbai', 'Bangalore'];
    return (
        <div className="row view-container">
            <div className="col-md state-dropdown">
                    <StateDropdown/>
            </div>
            <div className="col-md state-dropdown">
                    <CityDropdown cities={cities}/>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(RatingCharts), domContainer);