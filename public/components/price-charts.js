'use strict';
const selector = '#price-charts';
const e = React.createElement;

class PriceCharts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        selectedStates: [
      ],
      states: [ "AK",
                      "AL",
                      "AR",
                      "AS",
                      "AZ",
                      "CA",
                      "CO",
                      "CT",
                      "DC",
                      "DE",
                      "FL",
                      "GA",
                      "GU",
                      "HI",
                      "IA",
                      "ID",
                      "IL",
                      "IN",
                      "KS",
                      "KY",
                      "LA",
                      "MA",
                      "MD",
                      "ME",
                      "MI",
                      "MN",
                      "MO",
                      "MS",
                      "MT",
                      "NC",
                      "ND",
                      "NE",
                      "NH",
                      "NJ",
                      "NM",
                      "NV",
                      "NY",
                      "OH",
                      "OK",
                      "OR",
                      "PA",
                      "PR",
                      "RI",
                      "SC",
                      "SD",
                      "TN",
                      "TX",
                      "UT",
                      "VA",
                      "VI",
                      "VT",
                      "WA",
                      "WI",
                      "WV",
                      "WY"]
    }
  }

  drawChart(state) {
      console.log('Draw chart!!');
  }

  getStates() {
    return this.state.states.map(function (state) {
        return <option key={state}>{state}</option>
    })
  }

  render() {
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

const domContainer = document.querySelector(selector);
ReactDOM.render(e(PriceCharts), domContainer);