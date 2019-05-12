'use strict';
const selector = '#feature-charts';
const e = React.createElement;

class FeatureCharts extends React.Component {
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
        return <option value="{state.toLowerCase()}">{state}</option>
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
ReactDOM.render(e(FeatureCharts), domContainer);