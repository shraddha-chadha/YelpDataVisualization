'use strict';

const e = React.createElement;

class RatingsByStateChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedStates: [
      ],
      cuisines: ["mexican", "indian"]
    }
  }

  componentDidMount() {
      this.populateDropdownFromAPI();
  }

  populateDropdownFromAPI() {

  }

  drawChart(state) {
      console.log('Draw chart!!');
  }

  getStates() {
    return this.state.states.map(function (state) {
        return <option value="{state.toLowerCase()}">{state}</option>
    })
  }

  render() {
    console.log('React is doing its job...');
    this.drawChart();
    return (
        <div className="row view-container">
            <div className="col-md state-dropdown">
                <label>Select State</label>
                    <select className="selectpicker" placeholder="Select State">
                        {this.getStates()}
                    </select>
            </div>
            <div className="col-md state-dropdown">
                <label>Select State</label>
                <select className="selectpicker" placeholder="Select State">
                        {this.getStates()}
                </select>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector('#rating-charts');
ReactDOM.render(e(RatingsByStateChart), domContainer);