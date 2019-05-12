'use strict';
const selector = '#checkin-charts';
const e = React.createElement;

class CheckingCharts extends React.Component {
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

  onCitySelect(cityList) {
      this.setState({
          selectedCities: cityList
      });
  }

  onStateSelect(stateList) {
      this.setState({
          selectedStates: stateList
      });
  }

  render() {
    return (
        <div className="container p-0">
            <div className="row view-container">
                <div className="col-md state-filter chart-filters">
                    <StateDropdown onStateSelect={this.onStateSelect.bind(this)}/>
                </div>
                {this.state.selectedStates.length ? (
                    <div className="col-md cuisine-filter chart-filters">
                        <CityDropdown stateName={this.state.selectedStates[0]} onCitySelect={this.onCitySelect.bind(this)}/>
                    </div>
                ) : (null)}
            </div>
            <div className="row">
                <div className="col-md w-100" id="ratings-chart"></div>
            </div>
        </div>
    );
  }
}

const domContainer = document.querySelector(selector);
ReactDOM.render(e(CheckingCharts), domContainer);